// Illustrator Script: Merge selected text objects into one line (Left to Right, No Separator)
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
        // Sort left to right based on absolute X position (left) instead of layer order
        textFrames.sort(function(a, b) {
            return a.left - b.left;
        });
        
        // Merge text contents with no separator
        var combinedText = "";
        for (var j = 0; j < textFrames.length; j++) {
            combinedText += textFrames[j].contents;
        }
        
        // Update first text frame and remove the remaining frames
        textFrames[0].contents = combinedText;
        for (var k = 1; k < textFrames.length; k++) {
            textFrames[k].remove();
        }
    }
}