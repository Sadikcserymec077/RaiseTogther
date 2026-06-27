import React, { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import { AlertOctagon, CheckCircle2, XCircle, RefreshCw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('PENDING'); // 'PENDING' | 'RESOLVED' | 'DISMISSED' | ''
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal state for action
  const [activeReport, setActiveReport] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState(''); // 'RESOLVED' (Takedown) | 'DISMISSED' (Keep)
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchReports = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await reportApi.getReports(page, 10, statusFilter);
      if (data.success) {
        setReports(data.data.content || []);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.number);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(0);
  }, [statusFilter]);

  const handleOpenActionModal = (report, type) => {
    setActiveReport(report);
    setActionType(type);
    setRemarks('');
  };

  const handleCloseActionModal = () => {
    setActiveReport(null);
    setActionType('');
    setRemarks('');
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      toast.error('Please enter moderation remarks');
      return;
    }

    setSubmittingAction(true);
    try {
      const { data } = await reportApi.updateReportStatus(
        activeReport.id,
        actionType,
        remarks.trim()
      );
      if (data.success) {
        toast.success(`Report status updated to ${actionType}`);
        // Remove from list or update locally
        setReports(prev => prev.map(r => r.id === activeReport.id ? { ...r, status: actionType, remarks: remarks.trim() } : r));
        handleCloseActionModal();
        fetchReports(currentPage);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update report status');
    } finally {
      setSubmittingAction(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">Pending Review</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">Resolved (Takedown)</span>;
      case 'DISMISSED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Dismissed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  const getReasonBadge = (reason) => {
    switch (reason) {
      case 'FRAUD':
        return <span className="px-2 py-0.5 rounded text-xxs font-bold bg-purple-100 text-purple-800 uppercase">Fraud</span>;
      case 'SPAM':
        return <span className="px-2 py-0.5 rounded text-xxs font-bold bg-amber-100 text-amber-800 uppercase">Spam</span>;
      case 'HARASSMENT':
        return <span className="px-2 py-0.5 rounded text-xxs font-bold bg-red-100 text-red-800 uppercase">Harassment</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xxs font-bold bg-gray-100 text-gray-800 uppercase">{reason}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            <AlertOctagon className="w-8 h-8 text-red-500" />
            Report Moderation Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review flagged campaigns and issue takedowns or dismissals</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 text-xs px-3 py-1.5 bg-white font-medium"
          >
            <option value="">All Reports</option>
            <option value="PENDING">Pending Review</option>
            <option value="RESOLVED">Resolved (Takedown)</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
          
          <button
            onClick={() => fetchReports(currentPage)}
            className="p-1.5 border rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">No reports to display</p>
          <p className="text-xs text-gray-400 mt-1">Everything looks safe and clean!</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">Campaign</th>
                  <th className="py-4 px-6">Reported By</th>
                  <th className="py-4 px-6">Reason</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Moderation Remarks</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <a
                        href={`/campaign/${report.campaignId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        {report.campaignTitle || `ID: ${report.campaignId}`}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-xs">
                      {report.reporterEmail || 'Anonymous'}
                    </td>
                    <td className="py-4 px-6">
                      {getReasonBadge(report.reason)}
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-xs text-gray-600 line-clamp-2" title={report.description}>
                        {report.description}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-xs text-gray-500 italic">
                        {report.remarks || 'No remarks recorded'}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      {report.status === 'PENDING' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenActionModal(report, 'DISMISSED')}
                            className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-150 border border-green-200 rounded-lg transition-colors"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleOpenActionModal(report, 'RESOLVED')}
                            className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-150 border border-red-200 rounded-lg transition-colors"
                          >
                            Takedown
                          </button>
                        </div>
                      ) : (
                        <span className="text-xxs text-gray-400 font-medium italic">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-4 px-6 bg-gray-50 border-t">
              <button
                disabled={currentPage === 0}
                onClick={() => fetchReports(currentPage - 1)}
                className="px-3 py-1.5 border rounded-lg text-xs text-gray-600 hover:bg-gray-150 disabled:opacity-50 transition-colors bg-white font-medium"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => fetchReports(currentPage + 1)}
                className="px-3 py-1.5 border rounded-lg text-xs text-gray-600 hover:bg-gray-150 disabled:opacity-50 transition-colors bg-white font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Moderation Action Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                Moderation remarks: Report ID #{activeReport.id}
              </span>
              <button
                onClick={handleCloseActionModal}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitAction} className="p-6 space-y-4">
              <div className="text-xs text-gray-600 bg-indigo-50/30 border border-indigo-150 p-3 rounded-lg leading-relaxed">
                You are about to marking this report as{' '}
                <strong className={actionType === 'RESOLVED' ? 'text-red-600' : 'text-green-600'}>
                  {actionType === 'RESOLVED' ? 'RESOLVED (Takedown Campaign)' : 'DISMISSED (Keep Campaign)'}
                </strong>
                . This action is irreversible.
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Remarks / Reason for decision</label>
                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Record your moderation justification... (e.g. Campaign content violates policy Section 4, or No fraudulent activity detected after verification)"
                  className="w-full rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 text-xs p-3 resize-none border"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseActionModal}
                  disabled={submittingAction}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className={`text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                    actionType === 'RESOLVED'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {submittingAction ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
