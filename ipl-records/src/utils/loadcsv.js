import Papa from 'papaparse';

export const loadCSV = (path) => {
  console.log("📂 Trying to load:", path); // ✅ log file path
  return new Promise((resolve, reject) => {
    fetch(path)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch: " + res.status);
        }
        return res.text();
      })
      .then((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            console.log("✅ Parsed result:", result.data); // ✅ show data
            resolve(result.data);
          },
          error: (err) => reject(err),
        });
      })
      .catch(err => {
        console.error("❌ Error loading CSV:", err);
        reject(err);
      });
  });
};
