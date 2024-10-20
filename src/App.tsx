import React, { useState } from 'react';
import { Upload, CheckCircle, Image as ImageIcon, Zap } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setProcessedImage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    setLoading(true);

    try {
      const blob = await removeBackground(selectedFile, {
        progress: (progress) => {
          console.log(`Progress: ${progress}%`);
        },
      });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('An error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-black shadow-lg shadow-gray-700 ">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-3xl font-bold text-gray-100 text-center">ReBgImage</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-2xl md:text-4xl  font-extrabold text-gray-100 mb-4">
            Remove Image Backgrounds in Seconds
          </h2>
          <p className="text-md md:text-xl text-gray-300 max-w-2xl mx-auto">
            Our AI-powered tool makes it easy to remove backgrounds from your images.
            Upload, process, and download - it's that simple!
          </p>
          <div className='text-white border rounded-md border-emerald-200 px-4 py-2 mt-4 max-w-fit '>In Browser 🔐</div>
        </div>



        <div className="bg-black rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700  hover:border-orange-500 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-4 text-gray-50" />
                  <p className="mb-2 text-lg text-gray-100">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-300">PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
            {selectedFile && (
              <p className="sm:text-md text-lg text-white text-center">
                Selected file: {selectedFile.name}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              disabled={!selectedFile || loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2" /> Remove Background
                </>
              )}
            </button>
          </form>
          {processedImage && (
            <div className="mt-8">
              <h2 className="sm: text-md text-xl font-bold text-gray-100 mb-4">Processed Image:</h2>
              <div className="border-2 border-orange-500 rounded-lg p-2 bg-white">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <a
                href={processedImage}
                download="processed_image.png"
                className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <CheckCircle className="mr-2" /> Download Result
              </a>
            </div>
          )}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-50 mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="text-gray-50 mb-4">
                <Upload className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-xl font-semibold text-gray-100 mb-2">1. Upload</h4>
              <p className="text-gray-200">Select or drag and drop your image file.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="text-gray-50 mb-4">
                <Zap className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-xl font-semibold text-gray-100 mb-2">2. Process</h4>
              <p className="text-gray-200">Our AI removes the background in seconds.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="text-gray-50 mb-4">
                <ImageIcon className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-xl font-semibold text-gray-100 mb-2">3. Download</h4>
              <p className="text-gray-200">Get your image with a transparent background.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Ayush Jha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;