const output = document.getElementById('output');

async function runOpfsExample() {
  try {
    // Get a handle to the root of the Origin Private File System.
    const root = await navigator.storage.getDirectory();
console.log(root);
    // Create a new file handle.
    const fileHandle = await root.getFileHandle('test.txt', { create: true });

    // Get a writable stream.
    const writable = await fileHandle.createWritable();

    // Write some content to the file.
    await writable.write('Hello, OPFS!');

    // Close the writable stream.
    await writable.close();

    // Read the content of the file.
    const file = await fileHandle.getFile();
    const content = await file.text();

    output.textContent = `File 'test.txt' created and written to.\nFile content: ${content}`;
  } catch (error) {
    output.textContent = `Error: ${error.name}: ${error.message}`;
    console.error(error);
  }
}

document.getElementById('run-opfs-example').addEventListener('click', runOpfsExample);

async function downloadFile() {
  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle('test.txt');
    const file = await fileHandle.getFile();
    const content = await file.text();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'test.txt';
    a.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    output.textContent = `Error: ${error.name}: ${error.message}`;
    console.error(error);
  }
}

document.getElementById('download-file').addEventListener('click', downloadFile);