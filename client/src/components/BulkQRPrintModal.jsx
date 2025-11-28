import React, { useState, useRef, useEffect } from 'react';
import { X, Printer, Settings, Layout, Maximize, FileText, Type, Move, Save, Trash2, Plus, ArrowRight, ArrowDown } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const BulkQRPrintModal = ({ items, itemType, isOpen, onClose, getItemUrl }) => {
    const [paperSize, setPaperSize] = useState('a4');
    const [labelShape, setLabelShape] = useState('square'); // square or circle
    const [labelWidth, setLabelWidth] = useState(50); // mm
    const [labelHeight, setLabelHeight] = useState(50); // mm
    const [labelDiameter, setLabelDiameter] = useState(32); // mm for circular labels
    const [customPaperWidth, setCustomPaperWidth] = useState(210); // mm
    const [customPaperHeight, setCustomPaperHeight] = useState(297); // mm

    // Split Gap Settings
    const [labelSpacingX, setLabelSpacingX] = useState(2); // mm horizontal gap (column gap)
    const [labelSpacingY, setLabelSpacingY] = useState(2); // mm vertical gap (row gap)

    // Page Margins (mm)
    const [marginTop, setMarginTop] = useState(10);
    const [marginBottom, setMarginBottom] = useState(10);
    const [marginLeft, setMarginLeft] = useState(10);
    const [marginRight, setMarginRight] = useState(10);

    // Custom Paper Presets
    const [savedPresets, setSavedPresets] = useState([]);
    const [presetName, setPresetName] = useState('');

    const printRef = useRef();

    // Load presets from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('custom_paper_sizes');
        if (saved) {
            try {
                setSavedPresets(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved paper presets", e);
            }
        }
    }, []);

    if (!isOpen) return null;

    const defaultPaperSizes = {
        a4: { name: 'A4', width: 210, height: 297, unit: 'mm' },
        letter: { name: 'Letter', width: 216, height: 279, unit: 'mm' }, // 8.5" x 11" in mm
    };

    // Combine defaults and saved presets for logic
    const allPaperSizes = { ...defaultPaperSizes };
    savedPresets.forEach(preset => {
        allPaperSizes[preset.id] = { ...preset, unit: 'mm' };
    });
    allPaperSizes['custom'] = { name: 'Custom', width: customPaperWidth, height: customPaperHeight, unit: 'mm' };

    const handlePaperSizeChange = (e) => {
        const value = e.target.value;
        setPaperSize(value);

        // If selecting a saved preset, load ALL its settings
        if (value !== 'custom' && !defaultPaperSizes[value]) {
            const preset = savedPresets.find(p => p.id === value);
            if (preset) {
                // Paper Dims
                setCustomPaperWidth(preset.width);
                setCustomPaperHeight(preset.height);

                // Margins (check for existence to support legacy presets)
                if (preset.marginTop !== undefined) setMarginTop(preset.marginTop);
                if (preset.marginBottom !== undefined) setMarginBottom(preset.marginBottom);
                if (preset.marginLeft !== undefined) setMarginLeft(preset.marginLeft);
                if (preset.marginRight !== undefined) setMarginRight(preset.marginRight);

                // Label Config
                if (preset.labelShape) setLabelShape(preset.labelShape);
                if (preset.labelWidth) setLabelWidth(preset.labelWidth);
                if (preset.labelHeight) setLabelHeight(preset.labelHeight);
                if (preset.labelDiameter) setLabelDiameter(preset.labelDiameter);

                // Gaps
                if (preset.labelSpacingX !== undefined) setLabelSpacingX(preset.labelSpacingX);
                if (preset.labelSpacingY !== undefined) setLabelSpacingY(preset.labelSpacingY);
            }
        }
    };

    const handleSavePreset = () => {
        if (!presetName.trim()) return;

        const newPreset = {
            id: `custom_${Date.now()}`,
            name: presetName,
            width: customPaperWidth,
            height: customPaperHeight,
            // Save all other settings
            marginTop, marginBottom, marginLeft, marginRight,
            labelShape, labelWidth, labelHeight, labelDiameter,
            labelSpacingX, labelSpacingY
        };

        const updatedPresets = [...savedPresets, newPreset];
        setSavedPresets(updatedPresets);
        localStorage.setItem('custom_paper_sizes', JSON.stringify(updatedPresets));

        setPresetName('');
        setPaperSize(newPreset.id); // Switch to the new preset
    };

    const handleDeletePreset = () => {
        if (defaultPaperSizes[paperSize] || paperSize === 'custom') return;

        const updatedPresets = savedPresets.filter(p => p.id !== paperSize);
        setSavedPresets(updatedPresets);
        localStorage.setItem('custom_paper_sizes', JSON.stringify(updatedPresets));

        setPaperSize('a4'); // Revert to default
    };

    const calculateLayout = () => {
        const paper = allPaperSizes[paperSize] || allPaperSizes['custom'];
        const effectiveLabelWidth = labelShape === 'circle' ? labelDiameter : labelWidth;
        const effectiveLabelHeight = labelShape === 'circle' ? labelDiameter : labelHeight;

        // Calculate available area after margins
        const availableWidth = paper.width - marginLeft - marginRight;
        const availableHeight = paper.height - marginTop - marginBottom;

        // Use separate X and Y gaps
        const cols = Math.floor((availableWidth + labelSpacingX) / (effectiveLabelWidth + labelSpacingX));
        const rows = Math.floor((availableHeight + labelSpacingY) / (effectiveLabelHeight + labelSpacingY));

        return {
            cols: Math.max(1, cols),
            rows: Math.max(1, rows),
            itemsPerPage: Math.max(1, cols * rows),
            labelWidth: effectiveLabelWidth,
            labelHeight: effectiveLabelHeight
        };
    };

    const layout = calculateLayout();

    const handlePrint = () => {
        const printContent = printRef.current;

        // Convert canvases to images for printing
        const canvases = printContent.querySelectorAll('canvas');
        const canvasDataUrls = Array.from(canvases).map(c => c.toDataURL());

        // Create a clone to manipulate for printing
        const clone = printContent.cloneNode(true);
        const cloneCanvases = clone.querySelectorAll('canvas');

        cloneCanvases.forEach((canvas, index) => {
            const img = document.createElement('img');
            img.src = canvasDataUrls[index];
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            canvas.parentNode.replaceChild(img, canvas);
        });

        const paper = allPaperSizes[paperSize] || allPaperSizes['custom'];
        const windowPrint = window.open('', '', 'width=800,height=600');

        windowPrint.document.write(`
            <html>
                <head>
                    <title>Print QR Codes - ${itemType}s</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        @media print {
                            @page {
                                size: ${paper.width}mm ${paper.height}mm;
                                margin: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                            }
                            .page-container {
                                padding: 0;
                            }
                        }
                        
                        @media screen {
                            body {
                                background: #f3f4f6;
                                padding: 20px;
                            }
                        }
                        
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                        }
                        
                        .page-container {
                            width: ${paper.width}mm;
                            height: ${paper.height}mm;
                            background: white;
                            margin: 0 auto 20px;
                            padding: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm;
                            box-sizing: border-box;
                            page-break-after: always;
                        }
                        
                        .page-container:last-child {
                            page-break-after: auto;
                        }
                        
                        .qr-grid {
                            display: grid;
                            grid-template-columns: repeat(${layout.cols}, ${layout.labelWidth}mm);
                            column-gap: ${labelSpacingX}mm;
                            row-gap: ${labelSpacingY}mm;
                            justify-content: start;
                            align-content: start;
                            width: 100%;
                            height: 100%;
                        }
                        
                        .qr-item {
                            width: ${layout.labelWidth}mm;
                            height: ${layout.labelHeight}mm;
                            border: 1px dashed #ccc;
                            padding: 2mm;
                            box-sizing: border-box;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;
                            background: white;
                            page-break-inside: avoid;
                            ${labelShape === 'circle' ? 'border-radius: 50%;' : ''}
                        }
                        
                        .qr-content {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                        }
                        
                        .qr-code-wrapper {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            min-height: 0;
                        }
                        
                        .qr-code-wrapper.circle {
                            flex: 0 0 auto;
                            width: 65%;
                            height: 65%;
                            aspect-ratio: 1/1;
                        }
                        
                        .qr-code-wrapper img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                        }
                        
                        .qr-text-wrapper {
                            flex: none;
                            width: 100%;
                            text-align: center;
                        }
                        
                        .qr-text-wrapper.circle {
                            padding: 0 2mm;
                        }
                        
                        .qr-text-wrapper.circle.top {
                            margin-bottom: 0.5mm;
                        }
                        
                        .qr-text-wrapper.circle.bottom {
                            margin-top: 0.5mm;
                        }
                        
                        .qr-text-wrapper.square {
                            margin-top: 1mm;
                            padding: 0 1mm;
                        }
                        
                        .qr-item h3 {
                            margin: 0;
                            font-size: ${labelShape === 'circle' ? '6px' : '10px'};
                            font-weight: 600;
                            color: #000;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            line-height: 1.2;
                        }
                        
                        .qr-item p {
                            margin: 0;
                            font-size: ${labelShape === 'circle' ? '5px' : '8px'};
                            color: #333;
                            font-family: monospace;
                            line-height: 1.2;
                        }
                    </style>
                </head>
                <body>
                    ${clone.innerHTML}
                </body>
            </html>
        `);

        windowPrint.document.close();
        windowPrint.focus();

        setTimeout(() => {
            windowPrint.print();
            windowPrint.close();
        }, 500);
    };

    const getItemIdentifier = (item) => {
        if (itemType === 'asset') {
            return item.serial_number || 'N/A';
        } else if (itemType === 'component' || itemType === 'accessory') {
            return item.model_number || 'N/A';
        }
        return 'N/A';
    };

    const renderQRCodeWithPages = () => {
        const pages = [];
        let currentPage = [];

        items.forEach((item, index) => {
            currentPage.push(item);

            if ((index + 1) % layout.itemsPerPage === 0 || index === items.length - 1) {
                pages.push([...currentPage]);
                currentPage = [];
            }
        });

        const currentPaper = allPaperSizes[paperSize] || allPaperSizes['custom'];

        return pages.map((pageItems, pageIndex) => (
            <div
                key={pageIndex}
                className="page-container"
                style={{
                    width: `${currentPaper.width}mm`,
                    height: `${currentPaper.height}mm`,
                    padding: `${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm`,
                    boxSizing: 'border-box',
                    background: 'white',
                    margin: '0 auto 20px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div
                    className="qr-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${layout.cols}, ${layout.labelWidth}mm)`,
                        columnGap: `${labelSpacingX}mm`,
                        rowGap: `${labelSpacingY}mm`,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'start',
                        alignContent: 'start'
                    }}
                >
                    {pageItems.map((item) => (
                        <div
                            key={item.id}
                            className="qr-item"
                            style={{
                                width: `${layout.labelWidth}mm`,
                                height: `${layout.labelHeight}mm`,
                                border: '1px dashed #ccc',
                                padding: '2mm',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                background: 'white',
                                borderRadius: labelShape === 'circle' ? '50%' : '0'
                            }}
                        >
                            <div className="qr-content" style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Content for Circle: Name ABOVE QR */}
                                {labelShape === 'circle' ? (
                                    <>
                                        <div className="qr-text-wrapper circle top" style={{
                                            flex: 'none',
                                            width: '100%',
                                            textAlign: 'center',
                                            padding: '0 2mm',
                                            marginBottom: '0.5mm'
                                        }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '6px',
                                                fontWeight: 600,
                                                color: '#000',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: 1.2
                                            }}>
                                                {item.name}
                                            </h3>
                                        </div>
                                        <div
                                            className="qr-code-wrapper circle"
                                            style={{
                                                flex: '0 0 auto',
                                                width: '65%',
                                                height: '65%',
                                                aspectRatio: '1/1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <QRCodeCanvas
                                                value={getItemUrl(item)}
                                                size={Math.min(layout.labelWidth * 10, layout.labelHeight * 10)}
                                                level="H"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        </div>
                                        <div className="qr-text-wrapper circle bottom" style={{
                                            flex: 'none',
                                            width: '100%',
                                            textAlign: 'center',
                                            padding: '0 2mm',
                                            marginTop: '0.5mm'
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '5px',
                                                color: '#333',
                                                fontFamily: 'monospace',
                                                lineHeight: 1.2
                                            }}>
                                                {getItemIdentifier(item)}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    /* Content for Square: QR ABOVE Name (Standard) */
                                    <>
                                        <div
                                            className="qr-code-wrapper"
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                minHeight: 0
                                            }}
                                        >
                                            <QRCodeCanvas
                                                value={getItemUrl(item)}
                                                size={Math.min(layout.labelWidth * 10, layout.labelHeight * 10)}
                                                level="H"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </div>
                                        <div className="qr-text-wrapper square" style={{
                                            flex: 'none',
                                            width: '100%',
                                            textAlign: 'center',
                                            marginTop: '1mm',
                                            padding: '0 1mm'
                                        }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                color: '#000',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: 1.2
                                            }}>
                                                {item.name}
                                            </h3>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '8px',
                                                color: '#333',
                                                fontFamily: 'monospace',
                                                lineHeight: 1.2
                                            }}>
                                                {getItemIdentifier(item)}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <Printer className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Print QR Codes
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {items.length} items selected
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Settings */}
                    <div className="w-full md:w-80 lg:w-96 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-800 overflow-y-auto custom-scrollbar">
                        <div className="p-6 space-y-8">

                            {/* Paper Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <FileText size={18} />
                                    <h4>Paper Settings</h4>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Paper Size
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={paperSize}
                                            onChange={handlePaperSizeChange}
                                            className="flex-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                        >
                                            <optgroup label="Standard">
                                                <option value="a4">A4 (210 × 297 mm)</option>
                                                <option value="letter">Letter (8.5" × 11")</option>
                                            </optgroup>
                                            {savedPresets.length > 0 && (
                                                <optgroup label="Saved Presets">
                                                    {savedPresets.map(preset => (
                                                        <option key={preset.id} value={preset.id}>
                                                            {preset.name} ({preset.width} × {preset.height} mm)
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}
                                            <optgroup label="Custom">
                                                <option value="custom">Custom Size...</option>
                                            </optgroup>
                                        </select>

                                        {/* Delete Button for Saved Presets */}
                                        {paperSize !== 'custom' && !defaultPaperSizes[paperSize] && (
                                            <button
                                                onClick={handleDeletePreset}
                                                className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 transition-colors"
                                                title="Delete Preset"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Size Inputs & Save */}
                                {(paperSize === 'custom' || (!defaultPaperSizes[paperSize] && paperSize !== 'a4' && paperSize !== 'letter')) && (
                                    <div className="space-y-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                    Width (mm)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={customPaperWidth}
                                                    onChange={(e) => setCustomPaperWidth(parseFloat(e.target.value) || 0)}
                                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                    Height (mm)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={customPaperHeight}
                                                    onChange={(e) => setCustomPaperHeight(parseFloat(e.target.value) || 0)}
                                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Save Preset UI - Only show when in 'custom' mode */}
                                        {paperSize === 'custom' && (
                                            <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                <input
                                                    type="text"
                                                    placeholder="Preset Name (e.g. Label 118)"
                                                    value={presetName}
                                                    onChange={(e) => setPresetName(e.target.value)}
                                                    className="flex-1 p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                                <button
                                                    onClick={handleSavePreset}
                                                    disabled={!presetName.trim()}
                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    title="Save Preset"
                                                >
                                                    <Save size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Page Margins */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Move size={14} className="text-gray-500" />
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Page Margins (mm)
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Top</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={marginTop}
                                                onChange={(e) => setMarginTop(parseFloat(e.target.value) || 0)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Right</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={marginRight}
                                                onChange={(e) => setMarginRight(parseFloat(e.target.value) || 0)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Bottom</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={marginBottom}
                                                onChange={(e) => setMarginBottom(parseFloat(e.target.value) || 0)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Left</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={marginLeft}
                                                onChange={(e) => setMarginLeft(parseFloat(e.target.value) || 0)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Label Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <Layout size={18} />
                                    <h4>Label Configuration</h4>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Shape
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setLabelShape('square')}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${labelShape === 'square'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            Square / Rect
                                        </button>
                                        <button
                                            onClick={() => setLabelShape('circle')}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${labelShape === 'circle'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            Circle
                                        </button>
                                    </div>
                                </div>

                                {labelShape === 'square' ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Width (mm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={labelWidth}
                                                onChange={(e) => setLabelWidth(parseFloat(e.target.value) || 0)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Height (mm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={labelHeight}
                                                onChange={(e) => setLabelHeight(parseFloat(e.target.value) || 0)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Diameter (mm)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={labelDiameter}
                                            onChange={(e) => setLabelDiameter(parseFloat(e.target.value) || 0)}
                                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                )}

                                {/* Split Gap Controls */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gap Between Labels (mm)
                                    </label>
                                    <div className="space-y-3">
                                        {/* Horizontal Gap */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <ArrowRight size={14} className="text-gray-500" />
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    Horizontal (Column)
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                    value={labelSpacingX}
                                                    onChange={(e) => setLabelSpacingX(parseFloat(e.target.value))}
                                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={labelSpacingX}
                                                    onChange={(e) => setLabelSpacingX(parseFloat(e.target.value) || 0)}
                                                    className="w-20 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Vertical Gap */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <ArrowDown size={14} className="text-gray-500" />
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    Vertical (Row)
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                    value={labelSpacingY}
                                                    onChange={(e) => setLabelSpacingY(parseFloat(e.target.value))}
                                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={labelSpacingY}
                                                    onChange={(e) => setLabelSpacingY(parseFloat(e.target.value) || 0)}
                                                    className="w-20 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Side - Preview */}
                    <div className="flex-1 bg-gray-100 dark:bg-gray-900/50 overflow-auto p-8 flex flex-col items-center">
                        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                            <span className="font-medium text-gray-900 dark:text-white">Preview:</span>
                            {layout.cols} cols × {layout.rows} rows • {layout.itemsPerPage} items/page
                        </div>

                        <div className="transform origin-top transition-transform duration-200" ref={printRef}>
                            {renderQRCodeWithPages()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center z-10">
                    <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                        Tip: Use browser print settings to remove headers/footers
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 md:flex-none px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-600/20"
                        >
                            <Printer size={20} />
                            Print Labels
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkQRPrintModal;
