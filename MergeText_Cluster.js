// Illustrator Script: Smart Batch Merge (Handles both Vertical & Horizontal clusters)
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
        // 1. Group frames into distinct spatial clusters
        var clusters = clusterTextFrames(textFrames);
        
        // 2. Process each cluster independently based on its layout orientation
        for (var c = 0; c < clusters.length; c++) {
            var cluster = clusters[c];
            if (cluster.length <= 1) continue;
            
            // Calculate overall cluster bounds
            var minX = Infinity, maxX = -Infinity;
            var minY = Infinity, maxY = -Infinity;
            
            for (var k = 0; k < cluster.length; k++) {
                var bounds = cluster[k].geometricBounds; // [left, top, right, bottom]
                if (bounds[0] < minX) minX = bounds[0];
                if (bounds[2] > maxX) maxX = bounds[2];
                if (bounds[3] < minY) minY = bounds[3];
                if (bounds[1] > maxY) maxY = bounds[1];
            }
            
            var width = maxX - minX;
            var height = maxY - minY;
            
            // Determine orientation and sort
            if (height > width) {
                // Vertical cluster: Sort Bottom to Top (geometricBounds[3] ascending)
                cluster.sort(function(a, b) {
                    return a.geometricBounds[3] - b.geometricBounds[3];
                });
            } else {
                // Horizontal cluster: Sort Left to Right (geometricBounds[0] ascending)
                cluster.sort(function(a, b) {
                    return a.geometricBounds[0] - b.geometricBounds[0];
                });
            }
            
            // Merge text chunks (No spaces/separators)
            var mergedText = "";
            for (var m = 0; m < cluster.length; m++) {
                mergedText += cluster[m].contents;
            }
            
            // Update the primary frame (first item after sorting) and remove others in cluster
            cluster[0].contents = mergedText;
            for (var n = 1; n < cluster.length; n++) {
                cluster[n].remove();
            }
        }
    }
}

// Function to partition text frames into spatial groups based on proximity
function clusterTextFrames(frames) {
    var clusters = [];
    var visited = [];
    for (var i = 0; i < frames.length; i++) visited.push(false);
    
    for (var i = 0; i < frames.length; i++) {
        if (visited[i]) continue;
        
        var currentCluster = [frames[i]];
        visited[i] = true;
        
        var added = true;
        while (added) {
            added = false;
            for (var j = 0; j < frames.length; j++) {
                if (visited[j]) continue;
                
                // Check if frames[j] is close to any frame in currentCluster
                for (var k = 0; k < currentCluster.length; k++) {
                    if (areNearby(currentCluster[k], frames[j])) {
                        currentCluster.push(frames[j]);
                        visited[j] = true;
                        added = true;
                        break;
                    }
                }
            }
        }
        clusters.push(currentCluster);
    }
    return clusters;
}

// Proximity check function
function areNearby(a, b) {
    var bA = a.geometricBounds; // [left, top, right, bottom]
    var bB = b.geometricBounds;
    
    // Calculate distance between bounding boxes
    var xOverlap = Math.max(0, Math.min(bA[2], bB[2]) - Math.max(bA[0], bB[0]));
    var yOverlap = Math.max(0, Math.min(bA[1], bB[1]) - Math.max(bA[3], bB[3]));
    
    var xDistance = (bA[0] > bB[2]) ? (bA[0] - bB[2]) : ((bB[0] > bA[2]) ? (bB[0] - bA[2]) : 0);
    var yDistance = (bA[3] > bB[1]) ? (bA[3] - bB[1]) : ((bB[3] > bA[1]) ? (bB[3] - bA[1]) : 0);
    
    // Threshold in points (Adjust if text objects are spaced further apart)
    var threshold = 40; 
    
    return (xDistance <= threshold && yDistance <= threshold);
}