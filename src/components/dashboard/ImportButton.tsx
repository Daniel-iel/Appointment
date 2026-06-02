'use client';

import { useState, useRef } from 'react';
import { Appointment, Folga } from '@/lib/types';
import { importFromCSV, CSVImportValidationError, ImportError } from '@/lib/import';
import { colors } from '@/styles/design-tokens';
import { Upload, X, AlertCircle } from 'lucide-react';

export interface ImportButtonProps {
  onImportAppointments: (appointments: Appointment[]) => void;
  onImportFolgas: (folgas: Folga[]) => void;
}

export function ImportButton({ onImportAppointments, onImportFolgas }: ImportButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setErrors([]);
    setSuccessMessage(null);
    setIsProcessing(true);

    try {
      // Read file content
      const content = await file.text();
      
      // Import and validate
      const result = importFromCSV(content);

      // Call appropriate callback
      if (result.type === 'appointment') {
        onImportAppointments(result.data as Appointment[]);
        setSuccessMessage(`Successfully imported ${result.count} appointment(s)`);
      } else {
        onImportFolgas(result.data as Folga[]);
        setSuccessMessage(`Successfully imported ${result.count} time-off record(s)`);
      }

      // Show success for 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      if (error instanceof CSVImportValidationError) {
        setErrors(error.errors);
        setShowErrorModal(true);
      } else {
        setErrors([{
          row: 0,
          field: 'File',
          message: error instanceof Error ? error.message : 'Failed to import CSV file'
        }]);
        setShowErrorModal(true);
      }
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Import CSV file"
      />

      <button
        onClick={handleButtonClick}
        disabled={isProcessing}
        className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: colors['product-waypoint'],
          color: colors['inverse-ink'],
        }}
      >
        <Upload className="w-4 h-4" />
        {isProcessing ? 'Importing...' : 'Import CSV'}
      </button>

      {/* Success Toast */}
      {successMessage && (
        <div
          className="fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 flex items-center gap-2"
          style={{
            backgroundColor: colors['product-active'],
            color: colors['inverse-ink'],
          }}
        >
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowErrorModal(false)}
          />

          {/* Modal */}
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg shadow-xl z-50"
            style={{
              backgroundColor: colors['surface-1'],
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{
                borderColor: colors.hairline,
              }}
            >
              <div className="flex items-center gap-2">
                <AlertCircle
                  className="w-5 h-5"
                  style={{ color: colors['product-critical'] }}
                />
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.ink }}
                >
                  CSV Import Failed
                </h2>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="p-1 hover:opacity-70 transition-opacity"
                aria-label="Close"
              >
                <X className="w-5 h-5" style={{ color: colors.ink }} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <p
                className="mb-4"
                style={{ color: colors['ink-subtle'] }}
              >
                The CSV file contains {errors.length} validation error(s). All rows must be valid before import.
              </p>

              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="p-3 rounded border"
                    style={{
                      backgroundColor: colors['surface-2'],
                      borderColor: colors['product-critical'],
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: colors['product-critical'] }}
                      />
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: colors.ink }}
                        >
                          Row {error.row}, Field: {error.field}
                        </p>
                        <p
                          className="text-sm mt-1"
                          style={{ color: colors['ink-subtle'] }}
                        >
                          {error.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex justify-end p-4 border-t"
              style={{
                borderColor: colors.hairline,
              }}
            >
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 rounded-md font-medium text-sm transition-all hover:opacity-90"
                style={{
                  backgroundColor: colors['product-waypoint'],
                  color: colors['inverse-ink'],
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
