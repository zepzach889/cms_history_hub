# History Day Hub

A student hub for the after-school National History Day program: weekly schedule, checkpoint lessons, research tools, and a "My Work" folder. No logins, no AI, and no student data leaves the student's device.

## What's in this folder

| File | What it is | Edit it? |
| --- | --- | --- |
| `index.html` | The page itself | Rarely |
| `config.js` | Dates, lab schedule, Classroom link, announcement | **Yes, each year** |
| `app.js` | All the tools and logic | No |
| `topics.js` | The Topic Explorer list (about 300 topics) | When the theme changes, or to add topics |
| `style.css` | Colors, fonts, and layout | Only to change the look |

## Putting it on GitHub Pages

**Option A: its own repository (simplest)**

1. On GitHub, click **New repository**. Name it something like `history-day`. Make it **Public**.
2. Click **uploading an existing file**, then drag in all the files from this folder (not the folder itself). Click **Commit changes**.
3. Go to **Settings → Pages**. Under "Branch," choose `main` and `/ (root)`, then click **Save**.
4. After a minute or two, your site will be at `https://YOUR-USERNAME.github.io/history-day/`.

**Option B: inside your classroom suite repository**

1. In the suite repository, click **Add file → Upload files**.
2. Drag in this whole `history-day-hub` folder and commit.
3. The hub will be at `https://YOUR-USERNAME.github.io/YOUR-SUITE-REPO/history-day-hub/`.

Either way, post the link in Google Classroom.

## Settings to fill in before launch (`config.js`)

Open `config.js` on GitHub and click the pencil icon to edit.

- `classroomLink`: paste your Google Classroom class link between the quotes. This turns on the "Google Classroom" buttons.
- `teacherEmail`: optional. If filled in, it shows in the page footer.
- `announcement`: optional. Anything you type here shows at the top of the This Week page. Set it back to `""` to hide it.

Click **Commit changes**. The site updates within a couple of minutes. (If students don't see the change, have them refresh the page.)

## Updating for next year

Everything that changes each year lives in `config.js`:

1. Change `year` (for example, `"2028"`). This also gives students a fresh, empty workspace, so last year's saved work doesn't mix in.
2. Update `startDate`, each checkpoint's `due` date, and the `weeks` list (one line per week, starting on Monday).
3. Dates must be written as `"YYYY-MM-DD"`, with the quotes. Keep the commas at the ends of lines.

The theme text appears in `index.html` (in the header). Search for "Innovation in History" and replace it with the new theme. The lesson text in `app.js` mentions the theme in a few places, too.

## Updating the Topic Explorer

The topic list lives in `topics.js`. Each topic is one line: name, where, when, time period code, region code, a "think about" question, and search terms. Copy an existing line to add a new one. When the NHD theme changes, update the "think about" questions to match.

## How student work is saved

- Work saves automatically in the browser on the device the student is using. Nothing is sent anywhere.
- If a student clears their browser data or switches devices, their work won't follow them. That's why the **My Work** tab has two backup options:
  - **Download a backup file** (best on Chromebooks: save it to Google Drive)
  - **Make a backup code** (paste it at the bottom of their History Day Google Doc)
- **Restore from a backup** loads either one on any device.
- Encourage students to back up at the end of every work session, or at least before each checkpoint.

## About AI and NHD rules

None of the tools use AI. The Question Upgrader and Thesis Builder follow simple fixed rules (for example, "does the question start with *why* or *how*?") and only rearrange the words students type. The Citation Builder works like EasyBib or NoodleTools, which NHD lists as allowed. The Rules tab includes NHD's 2026–2027 AI policy for students.

## Testing it on your own computer

Download the folder and double-click `index.html`. Everything works offline except the fonts and the research links.
