import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface ActionControlsProps<T> {
  config?: {
    export?: {
      enabled: boolean;
      filename?: string;
      customHandler?: (data: T[]) => void;
      headers?: string[];
      fieldMapping?: Record<string, keyof T>;
    };
    refresh?: {
      enabled: boolean;
      handler: () => void;
    };
  };
  data: T[];
}

const ActionControls = <T extends Record<string, any>>({
  config,
  data
}: ActionControlsProps<T>) => {
  const handleExport = () => {
    const exportConfig = config?.export;
    if (!exportConfig) return;

    if (exportConfig.customHandler) {
      exportConfig.customHandler(data);
      return;
    }

    const headers = exportConfig.headers || Object.keys(data[0] || {});
    const fieldMapping = exportConfig.fieldMapping || {};

    const csvContent = [
      headers.join(','),
      ...data.map((item) =>
        headers
          .map((header) => {
            const field = fieldMapping[header] || header;
            const value = String(item[field] || '');
            return value.includes(',') ? `"${value}"` : value;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportConfig.filename || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {config?.export?.enabled && data.length > 0 && (
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      )}

      {config?.refresh?.enabled && (
        <Button onClick={config.refresh.handler} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      )}
    </>
  );
};

export default ActionControls;
