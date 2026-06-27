package com.crowdcash.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    @Autowired
    private Cloudinary cloudinary;

    public String storeFile(MultipartFile file, String folder) throws IOException {
        Map params = ObjectUtils.asMap(
            "folder", "crowdcash/" + folder,
            "resource_type", "auto"
        );
        Map result = cloudinary.uploader().upload(file.getBytes(), params);
        return (String) result.get("secure_url");
    }

    public String storeFile(MultipartFile file) {
        try {
            return storeFile(file, "general");
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file on Cloudinary. Please try again!", ex);
        }
    }
}
