# MergeText_AI (Adobe Illustrator Script)

A set of Adobe Illustrator ExtendScript (`.jsx`) utilities designed to quickly merge multiple selected text frames into a single text frame.

---

## Key Features & Functionality

* **`MergeText_Silent.jsx`**
  * **Horizontal Left-to-Right Sorting:** Automatically sorts selected text frames based on their physical X-axis position (`left`) on the artboard, regardless of layer stacking order.
  * **One-Line Merge:** Combines all selected text frames into a single continuous text frame without adding extra line breaks (`\r`) or spaces.
  * **Non-Disruptive Workflow:** Operates silently without prompting dialog boxes, ideal for high-speed action automation.

* **`MergeText_AI.jsx`**
  * **Interactive Dialog Interface:** Allows customized sorting criteria (Top, Left, Bottom, Right).
  * **Custom Separators:** Supports user-defined delimiters such as spaces, tabs (`\t`), or newlines (`\r`).

---

## Step-by-Step Setup for Illustrator Actions

Assigning the silent merge script to an Illustrator Action enables single-click execution or custom keyboard shortcuts.

### Step 1: Place the Script File in the Illustrator Scripts Directory

1. Save `MergeText_Silent.jsx` to your computer.
2. Move the file into your Adobe Illustrator **Scripts** directory:
   * **macOS:** `/Applications/Adobe Illustrator <Version>/Presets/<Language>/Scripts`
   * **Windows:** `C:\Program Files\Adobe\Adobe Illustrator <Version>\Presets\<Language>\Scripts`
3. Restart Adobe Illustrator if it was open.

---

### Step 2: Record an Illustrator Action

1. Open Adobe Illustrator and select **Window > Actions** to open the Actions panel.
2. Click the **Create New Action** icon (plus icon) at the bottom of the Actions panel.
3. In the dialog box:
   * **Name:** `Merge Text to One Line`
   * **Function Key:** Choose a preferred shortcut key (e.g., `F9` or `Cmd/Ctrl + F9`).
   * Click **Record**.

---

### Step 3: Insert the Script into the Action

1. With recording active, click the Actions panel menu (top-right flyout icon).
2. Select **Insert Menu Item...**
3. In the dialog, type `MergeText_Silent` (or manually navigate via **File > Scripts > MergeText_Silent** in the main menu bar).
4. Click **OK** to insert the menu item into the action steps.
5. Click the **Stop Recording** button (square icon) at the bottom of the Actions panel.

---

### Step 4: Usage Instructions

1. Select two or more text frames on your artboard.
2. Execute the action by either:
   * Pressing the assigned **Function Key shortcut** (e.g., `F9`).
   * Selecting the action in the Actions panel and clicking **Play**.
3. All selected text frames will merge into the leftmost text frame in left-to-right order as a single continuous line.
