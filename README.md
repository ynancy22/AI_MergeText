# MergeText_AI (Adobe Illustrator Scripts)

A suite of Adobe Illustrator ExtendScript (`.jsx`) utilities designed to merge fragmented text objects into unified text frames. Specially optimized for cleaning up imported vectorized plots (such as MATLAB, Python/Matplotlib, or R figures) where labels and titles are often exported as fragmented, disconnected character chunks.

---

## 🚀 Overview of Included Scripts

### 1. `MergeText_Smart_Batch_Isolated.jsx` *(Recommended)*
* **Rotation-Aware Clustering:** Uses transformation matrix analysis to prevent rotated Y-axis labels (~90°) from merging with horizontal tick marks or titles (0°).
* **Numeric Tick Protection:** Automatically isolates standalone numerical values (e.g., `0`, `10`, `20`) so axis tick numbers are never accidentally merged into word labels.
* **Auto-Orientation:** Automatically detects whether a text cluster is horizontal (sorts Left to Right) or vertical (sorts Bottom to Top).
* **Batch Processing:** Safe to execute across entire subpanel figures without lumping unrelated text chunks together.

### 2. `MergeText_Silent.jsx`
* **Horizontal One-Line Merge:** Sorts selected text frames strictly Left to Right based on their physical X-axis position (`left`) on the artboard, ignoring layer stacking order.
* **Zero Delimiter:** Concatenates contents directly without adding extra spaces or newline breaks (`\r`).

### 3. `MergeText_Vertical_BottomToTop.jsx`
* **Vertical Column Merge:** Groups selected text frames into vertical columns and sorts items from Bottom to Top based on geometric Y-bounds.

### 4. `MergeText_AI.jsx`
* **Interactive UI:** Provides a legacy dialog interface to select manual sorting directions (Top, Left, Bottom, Right) and custom delimiters (such as spaces, `\t`, or `\r`).

---

## ⚙️ Step-by-Step Setup for Illustrator Actions

Automation via Adobe Illustrator Actions allows you to bind these scripts to single-click shortcuts or function keys.

### Step 1: Install Scripts

1. Copy the desired `.jsx` script files to your local machine.
2. Place them in your Adobe Illustrator **Scripts** folder:
   * **macOS:** `/Applications/Adobe Illustrator <Version>/Presets/<Language>/Scripts`
   * **Windows:** `C:\Program Files\Adobe\Adobe Illustrator <Version>\Presets\<Language>\Scripts`
3. Restart Adobe Illustrator.

---

### Step 2: Import Pre-configured Action Set (Optional)

If you have the `Figure.aia` file:
1. Open the **Actions Panel** (`Window > Actions`).
2. Click the panel menu icon (top-right corner) and select **Load Actions...**.
3. Choose `Figure.aia` to import the pre-configured shortcuts.

---

### Step 3: Record a Custom Action Manually

1. Open **Window > Actions**.
2. Click the **Create New Action** button (+ icon).
3. Assign a name (e.g., `Auto Merge Text`) and a shortcut key (e.g., `F12`).
4. Click **Record**.
5. Open the Actions panel menu (top-right flyout icon) and choose **Insert Menu Item...**.
6. Type the exact script name (e.g., `MergeText_Smart_Batch_Isolated` or `MergeText_Silent`) or navigate to **File > Scripts > [Script Name]**.
7. Click **OK**, then click **Stop Recording** (square icon).

---

## 📖 Usage Instructions

1. Select one or multiple text frames on your artboard.
2. Press the assigned shortcut key or click **Play** in the Actions panel.
3. Target text objects will merge in place, updating the primary frame and removing redundant chunks.

---

## 🔗 References & Credits

* Original **MergeText** concept and script implementation by **Justin Putney** ([Ajar Productions](https://ajarproductions.com)).
  * Reference post: [Merge Text Extension for Illustrator - Ajar Productions](https://ajarproductions.com/blog/2008/11/23/merge-text-extension-for-illustrator/)
* UI Dialog framework built using `ominoDialogMaker.jsx` by **David Van Brink** ([Omino Pixelblog](http://omino.com/pixelblog/2008/09/21/35/)).
