import { useState, useEffect } from 'react';

type NFCEventCallback = (serialNumber: string, records: ReadonlyArray<NDEFRecord>) => void;

export default function useNFCListener(
  onTap: NFCEventCallback,
  onError: (error: string) => void
) {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let nfcReader: NDEFReader | null = null;

    const startScanning = async () => {
      if (!('NDEFReader' in window)) {
        onError('Web NFC is not supported in this browser.');
        return;
      }

      try {
        nfcReader = new NDEFReader();

        // Start scanning for NFC tags
        await nfcReader.scan();
        setIsScanning(true);
        console.log('NFC scanning started.');

        // Handle successful NFC read
        nfcReader.onreading = (event: NDEFReadingEvent) => {
          console.log('NFC tag detected!');
          console.log('Serial Number:', event.serialNumber);

          const records = event.message.records;
          onTap(event.serialNumber, records);
        };

        // Handle NFC read errors
        nfcReader.onreadingerror = (error: Event) => {
          console.error('Error reading NFC tag:', error);
          onError('Error reading NFC tag.');
        };
      } catch (error) {
        console.error('Error initializing NFC reader:', error);
        onError('Failed to start NFC scanning.');
      }
    };

    // Start scanning when the component is mounted
    startScanning();

    // Cleanup on unmount
    return () => {
      if (nfcReader) {
        nfcReader = null;
      }
      setIsScanning(false);
    };
  }, [onTap, onError]);

  return { isScanning };
}
