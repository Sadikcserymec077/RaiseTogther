import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8089/ws';
    
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        setIsConnected(true);
        console.log('STOMP connected successfully');
        
        // Re-subscribe to any active subscriptions in case of reconnection
        Object.keys(subscriptionsRef.current).forEach((topic) => {
          const { callback } = subscriptionsRef.current[topic];
          const sub = client.subscribe(topic, (message) => {
            callback(JSON.parse(message.body));
          });
          subscriptionsRef.current[topic].sub = sub;
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log('STOMP disconnected');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  // Listen to personal notification queue if user is logged in
  useEffect(() => {
    if (user && isConnected && clientRef.current) {
      const topic = `/user/${user.id}/queue/notifications`;
      
      const sub = clientRef.current.subscribe(topic, (message) => {
        const body = JSON.parse(message.body);
        // Dispatch custom event for personal notifications
        const event = new CustomEvent('app-notification', { detail: body });
        window.dispatchEvent(event);
      });

      return () => {
        sub.unsubscribe();
      };
    }
  }, [user, isConnected]);

  const subscribe = (topic, callback) => {
    if (subscriptionsRef.current[topic]) {
      // Already subscribed to this topic
      return;
    }

    let sub = null;
    if (isConnected && clientRef.current) {
      sub = clientRef.current.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      });
    }

    subscriptionsRef.current[topic] = { callback, sub };
  };

  const unsubscribe = (topic) => {
    const existing = subscriptionsRef.current[topic];
    if (existing) {
      if (existing.sub) {
        existing.sub.unsubscribe();
      }
      delete subscriptionsRef.current[topic];
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};
