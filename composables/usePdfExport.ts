import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

export const usePdfExport = () => {
    const colorMode = useColorMode();

    const exportToPdf = async () => {
        const element = document.body;
        const originalTheme = colorMode.preference;

        // Force Dark Mode for the PDF
        colorMode.preference = 'dark';

        // Wait for the theme change to propagate
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            console.log('Generating canvas...');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#111827', // dark-900 like
                windowWidth: 1600 // Ensure wide layout
            });

            console.log('Canvas generated. Creating PDF...');
            const imgData = canvas.toDataURL('image/png');

            // 16:9 ratio page in inches (landscape presentation)
            const PAGE_WIDTH = 16;
            const PAGE_HEIGHT = 9;

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'in',
                format: [PAGE_WIDTH, PAGE_HEIGHT]
            });

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Scale image width to fit PDF page width
            const pdfImgWidth = PAGE_WIDTH;
            const pdfImgHeight = (imgHeight * PAGE_WIDTH) / imgWidth;

            let heightLeft = pdfImgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfImgWidth, pdfImgHeight);
            heightLeft -= PAGE_HEIGHT;

            // Loop for valid multi-page
            while (heightLeft > 0) {
                position = heightLeft - pdfImgHeight; // This is wrong for standard top-down.
                // Correct logic: we move the image UP.
                // Page 2: image is drawn at y = -PAGE_HEIGHT
                // Page 3: image is drawn at y = -PAGE_HEIGHT * 2

                position = - (pdfImgHeight - heightLeft);
                // Wait, simpler:
                // Page 1: y=0. Covered 0 to 9.
                // Page 2: y=-9. Covered 9 to 18.
                // heightLeft tracks remaining content?
                // Let's use an index.

                pdf.addPage();
                // Calculate position for next page
                // We want to show the slice starting at (PDF_HEIGHT * pageIndex)
                // So we draw the image shifted up by that amount.
                const pageIndex = pdf.getNumberOfPages() - 1;
                const shift = -pageIndex * PAGE_HEIGHT;

                pdf.addImage(imgData, 'PNG', 0, shift, pdfImgWidth, pdfImgHeight);
                heightLeft -= PAGE_HEIGHT;
            }

            console.log('Saving PDF...');
            pdf.save('my-profile.pdf');

        } catch (e) {
            console.error('Export failed:', e);
        } finally {
            // Restore original theme
            colorMode.preference = originalTheme;
        }
    };

    return {
        exportToPdf
    };
}
