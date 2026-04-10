import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useLocation } from "wouter";

export default function PrescriptionUpload() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [extractedMedicines, setExtractedMedicines] = useState<string[]>([]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to upload prescriptions.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // In a real implementation, this would:
      // 1. Upload file to S3 using storagePut
      // 2. Call LLM with vision capability to extract medicine names
      // 3. Save prescription record to database
      // 4. Display extracted medicines

      // For now, simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated extracted medicines
      const simulated = ["Aspirin 500mg", "Metformin 1000mg", "Lisinopril 10mg"];
      setExtractedMedicines(simulated);
      setUploadStatus("success");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-black">Upload Prescription</h1>
          </div>
          {isAuthenticated && (
            <span className="text-sm text-muted-foreground">{user?.name}</span>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Upload Area */}
          {uploadStatus === "idle" && (
            <Card className="p-8 border-2 border-dashed border-accent/30 hover:border-accent/50 transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-black mb-2">Upload Your Prescription</h2>
                <p className="text-muted-foreground mb-6">
                  Upload an image or PDF of your prescription. Our AI will extract medicine
                  names and help you find affordable alternatives.
                </p>

                <div className="mb-6">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="inline-block">
                    <Button
                      className="bg-accent hover:bg-accent/90 cursor-pointer"
                    >
                      Choose File
                    </Button>
                  </label>
                </div>

                {file && (
                  <div className="bg-background p-4 rounded-lg mb-6 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-foreground">
                        {file.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                {preview && (
                  <div className="mb-6">
                    <img
                      src={preview}
                      alt="Prescription preview"
                      className="max-h-64 mx-auto rounded-lg border border-border"
                    />
                  </div>
                )}

                {file && (
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-accent hover:bg-accent/90 w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Extract Medicines"
                    )}
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Success State */}
          {uploadStatus === "success" && extractedMedicines.length > 0 && (
            <div className="space-y-6">
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-black text-green-900 mb-2">
                      Prescription Processed Successfully
                    </h3>
                    <p className="text-green-700">
                      We found {extractedMedicines.length} medicine(s) in your
                      prescription. Click on any medicine below to find affordable
                      alternatives.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Extracted Medicines */}
              <div className="space-y-3">
                <h3 className="text-lg font-black">Extracted Medicines</h3>
                {extractedMedicines.map((medicine, idx) => (
                  <Card
                    key={idx}
                    className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {medicine}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Tap to find alternatives and pricing
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/search")}
                      >
                        Analyze
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setUploadStatus("idle");
                  setExtractedMedicines([]);
                }}
              >
                Upload Another Prescription
              </Button>
            </div>
          )}

          {/* Error State */}
          {uploadStatus === "error" && (
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-black text-red-900 mb-2">
                    Processing Failed
                  </h3>
                  <p className="text-red-700 mb-4">
                    We couldn't process your prescription. Please try again or
                    upload a clearer image.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setUploadStatus("idle");
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
