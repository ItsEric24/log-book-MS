import "./App.css";

function App() {
  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:3000/generate-pdf", {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      });

      const blob = await response.blob();

      // Create a URL for the blob
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "weekly-log.pdf";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error(error);
    }
  }

  return <button onClick={handleDownload}>Download Report</button>;
}

export default App;
