import React, { useState, useRef } from 'react';
import styles from './Scene.module.css';

const Scene: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContainerClick = () => {
    if (!imageSrc && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.scene}>
      <h2 className={styles.title}>Scene</h2>
      <div className={styles.container} onClick={handleContainerClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.fileInput}
        />
        {imageSrc ? (
          <div className={styles.imageWrapper}>
            <img
              src={imageSrc}
              alt="Scene"
              className={styles.sceneImage}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleRemoveImage}
              className={styles.uploadButton}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#f44336',
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p className={styles.placeholderText}>Image placeholder</p>
            <p className={styles.instruction}>
              Click to upload image or describe it below
            </p>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Upload Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scene;

