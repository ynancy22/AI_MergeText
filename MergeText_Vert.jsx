// Illustrator Script: Merge vertical text frames from Bottom to Top (clustered by column)
if (app.documents.length > 0) {
    var doc = app.activeDocument;
    var sel = doc.selection;
    
    // Filter selected text frames
    var textFrames = [];
    for (var i = 0; i < sel.length; i++) {
        if (sel[i].typename === "TextFrame") {
            textFrames.push(sel[i]);
        }
    }
    
    if (textFrames.length > 1) {
        // 1. Sort all text frames roughly from Left to Right
        textFrames.sort(function(a, b) {
            return a.left - b.left;
        });
        
        // 2. Group into vertical columns using horizontal bounding box overlap
        var columns = [];
        
        for (var j = 0; j < textFrames.length; j++) {
            var tf = textFrames[j];
            var tfLeft = tf.left;
            var tfRight = tfLeft + tf.width;
            var placedInColumn = false;
            
            // Check if this text frame visually aligns horizontally with an existing column
            for (var c = 0; c < columns.length; c++) {
                var col = columns[c];
                // Calculate average left and right bounds of the current column
                var colLeft = 0, colRight = 0;
                for (var k = 0; k < col.length; k++) {
                    colLeft += col[k].left;
                    colRight += (col[k].left + col[k].width);
                }
                colLeft /= col.length;
                colRight /= col.length;
                
                // Determine horizontal overlap
                var overlap = Math.min(tfRight, colRight) - Math.max(tfLeft, colLeft);
                var minWidth = Math.min(tf.width, (colRight - colLeft));
                
                // If horizontal overlap exceeds 30% of width, place in the same vertical column
                if (overlap > (minWidth * 0.3)) {
                    col.push(tf);
                    placedInColumn = true;
                    break;
                }
            }
            
            // If no matching column found, start a new column
            if (!placedInColumn) {
                columns.push([tf]);
            }
        }
        
        // 3. Sort columns from Left to Right based on average X position
        columns.sort(function(a, b) {
            var aX = 0, bX = 0;
            for (var i = 0; i < a.length; i++) aX += a[i].left;
            for (var j = 0; j < b.length; j++) bX += b[j].left;
            return (aX / a.length) - (bX / b.length);
        });
        
        // 4. For each column, sort frames Bottom to Top and merge text
        var columnTexts = [];
        for (var colIdx = 0; colIdx < columns.length; colIdx++) {
            var currentCol = columns[colIdx];
            
            // Sort Bottom to Top (smaller Y position values come first)
            currentCol.sort(function(a, b) {
                return a.position[1] - b.position[1];
            });
            
            // Merge text within this column (Bottom to Top, no spaces)
            var colContent = "";
            for (var itemIdx = 0; itemIdx < currentCol.length; itemIdx++) {
                colContent += currentCol[itemIdx].contents;
            }
            columnTexts.push(colContent);
        }
        
        // 5. Combine columns (if multiple vertical columns are selected) with line breaks (\r)
        var finalText = columnTexts.join("\r");
        
        // 6. Update primary frame (bottom-leftmost) and remove all other frames
        var primaryFrame = columns[0][0];
        primaryFrame.contents = finalText;
        
        for (var n = 0; n < textFrames.length; n++) {
            if (textFrames[n] !== primaryFrame) {
                textFrames[n].remove();
            }
        }
    }
}