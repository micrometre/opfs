const output = document.getElementById('output');

// Helper function to update output with styling
function updateOutput(message, type = 'info') {
  output.textContent = message;
  output.className = `output-area ${type}`;
  
  // Remove placeholder
  const placeholder = output.querySelector('.output-placeholder');
  if (placeholder) {
    placeholder.remove();
  }
}

// Helper function to add loading state to button
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

async function runOpfsExample() {
  const button = document.getElementById('run-opfs-example');
  setButtonLoading(button, true);
  
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

    updateOutput(`✅ File 'test.txt' created and written to.\nFile content: ${content}`, 'success');
  } catch (error) {
    updateOutput(`❌ Error: ${error.name}: ${error.message}`, 'error');
    console.error(error);
  } finally {
    setButtonLoading(button, false);
  }
}

document.getElementById('run-opfs-example').addEventListener('click', runOpfsExample);

async function downloadFile() {
  const button = document.getElementById('download-file');
  setButtonLoading(button, true);
  
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
    updateOutput(`📥 Downloaded 'test.txt' successfully!`, 'success');
  } catch (error) {
    updateOutput(`❌ Error: ${error.name}: ${error.message}`, 'error');
    console.error(error);
  } finally {
    setButtonLoading(button, false);
  }
}

document.getElementById('download-file').addEventListener('click', downloadFile);

async function createFile() {
  const button = document.getElementById('create-file');
  setButtonLoading(button, true);
  
  try {
    const fileName = document.getElementById('file-name-input').value.trim();
    const fileContent = document.getElementById('file-content-input').value;

    if (!fileName) {
      updateOutput('⚠️ Please enter a filename.', 'error');
      return;
    }

    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(fileName, { create: true });

    const writable = await fileHandle.createWritable();
    await writable.write(fileContent);
    await writable.close();

    updateOutput(`✅ File '${fileName}' created successfully!\nContent length: ${fileContent.length} characters`, 'success');
  } catch (error) {
    updateOutput(`❌ Error: ${error.name}: ${error.message}`, 'error');
    console.error(error);
  } finally {
    setButtonLoading(button, false);
  }
}

document.getElementById('create-file').addEventListener('click', createFile);

async function downloadCreatedFile() {
  const button = document.getElementById('download-created-file');
  setButtonLoading(button, true);
  
  try {
    const fileName = document.getElementById('file-name-input').value.trim();
    
    if (!fileName) {
      updateOutput('⚠️ Please enter a filename to download.', 'error');
      return;
    }

    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    const content = await file.text();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
    updateOutput(`📥 Downloaded '${fileName}' successfully!\nFile size: ${content.length} characters`, 'success');
  } catch (error) {
    updateOutput(`❌ Error: ${error.name}: ${error.message}`, 'error');
    console.error(error);
  } finally {
    setButtonLoading(button, false);
  }
}

document.getElementById('download-created-file').addEventListener('click', downloadCreatedFile);