// Illustrator Script: Advanced Batch Merge with Rotation & Numeric Isolation
if (app.documents.length > 0) {
    var doc = app.activeDocument;
    var sel = doc.selection;
    
    var textFrames = [];
    for (var i = 0; i < sel.length; i++) {
        if (sel[i].typename === "TextFrame") {
            textFrames.push(sel[i]);
        }
    }
    
    if (textFrames.length > 1) {
        // Partition into intelligent, angle-aware clusters
        var clusters = smartClusterTextFrames(textFrames);
        
        for (var c = 0; c < clusters.length; c++) {
            var cluster = clusters[c];
            if (cluster.length <= 1) continue;
            
            // Determine orientation based on text frame rotation matrix or bounding box
            var isVertical = isClusterVertical(cluster);
            
            if (isVertical) {
                // Vertical Cluster: Sort Bottom to Top (b[3] ascending)
                cluster.sort(function(a, b) {
                    return a.geometricBounds[3] - b.geometricBounds[3];
                });
            } else {
                // Horizontal Cluster: Sort Left to Right (b[0] ascending)
                cluster.sort(function(a, b) {
                    return a.geometricBounds[0] - b.geometricBounds[0];
                });
            }
            
            // Concatenate text contents (No space)
            var mergedText = "";
            for (var m = 0; m < cluster.length; m++) {
                mergedText += cluster[m].contents;
            }
            
            // Apply to primary frame and remove merged children
            cluster[0].contents = mergedText;
            for (var n = 1; n < cluster.length; n++) {
                cluster[n].remove();
            }
        }
    }
}

function smartClusterTextFrames(frames) {
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
                
                for (var k = 0; k < currentCluster.length; k++) {
                    if (canMergeTogether(currentCluster[k], frames[j])) {
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

function canMergeTogether(a, b) {
    // Check 1: Rotation angle matching
    // Rotated Y-axis text (usually ~90 deg) should NEVER merge with unrotated text (0 deg)
    var rotA = getRotationAngle(a);
    var rotB = getRotationAngle(b);
    if (Math.abs(rotA - rotB) > 5) {
        return false;
    }
    
    // Check 2: Pure standalone numeric ticks isolation
    // Avoid merging tick values (e.g. "10", "20") with word chunks if they belong to different logical elements
    var isNumA = /^\s*-?\d+(\.\d+)?\s*$/.test(a.contents);
    var isNumB = /^\s*-?\d+(\.\d+)?\s*$/.test(b.contents);
    
    // If one is a pure number tick and the other is label text, do not merge them
    if (isNumA !== isNumB) {
        return false;
    }
    
    // Check 3: Spatial alignment & distance check
    var bA = a.geometricBounds; // [left, top, right, bottom]
    var bB = b.geometricBounds;
    
    var xOverlap = Math.max(0, Math.min(bA[2], bB[2]) - Math.max(bA[0], bB[0]));
    var yOverlap = Math.max(0, Math.min(bA[1], bB[1]) - Math.max(bA[3], bB[3]));
    
    var minWidth = Math.min(bA[2] - bA[0], bB[2] - bB[0]);
    var minHeight = Math.min(bA[1] - bA[3], bB[1] - bB[3]);
    
    var yGap = (bA[3] > bB[1]) ? (bA[3] - bB[1]) : ((bB[3] > bA[1]) ? (bB[3] - bA[1]) : 0);
    var xGap = (bA[0] > bB[2]) ? (bA[0] - bB[2]) : ((bB[0] > bA[2]) ? (bB[0] - bA[2]) : 0);
    
    var gapThreshold = 12; // Tight gap tolerance
    
    // If rotated (~90 deg), evaluate vertical line alignment
    if (Math.abs(rotA) > 45) {
        return (xOverlap > minWidth * 0.1) && (yGap <= gapThreshold);
    } else {
        // Standard horizontal line alignment
        return (yOverlap > minHeight * 0.1) && (xGap <= gapThreshold);
    }
}

function getRotationAngle(tf) {
    var matrix = tf.matrix;
    // Calculate rotation angle in degrees from transformation matrix
    var angle = Math.atan2(matrix.mValueB, matrix.mValueA) * (180 / Math.PI);
    return Math.abs(angle);
}

function isClusterVertical(cluster) {
    // If text inside is rotated around 90/270 degrees, it's vertical
    var angle = getRotationAngle(cluster[0]);
    if (angle > 45 && angle < 135) return true;
    
    // Otherwise check cluster aspect ratio
    var minX = Infinity, maxX = -Infinity;
    var minY = Infinity, maxY = -Infinity;
    for (var k = 0; k < cluster.length; k++) {
        var b = cluster[k].geometricBounds;
        if (b[0] < minX) minX = b[0];
        if (b[2] > maxX) maxX = b[2];
        if (b[3] < minY) minY = b[3];
        if (b[1] > maxY) maxY = b[1];
    }
    return (maxY - minY) > (maxX - minX);
}