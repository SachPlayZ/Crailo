"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Plus,
  DollarSign,
  Image as ImageIcon,
  Shield,
} from "lucide-react";
import { PinataSDK } from "pinata";
import { useListing } from "@/utils/listing";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL!,
});


interface IPFSFile {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface Metadata {
  title: string;
  description: string;
  price: number;
  location: string;
  seller: {
    name: string;
    address: string;
  };
  images: string[];
  category: string;
  condition: string;
  escrowAmount: number;
}

interface ListItemDialogProps {
  children: React.ReactNode;
}

const ListItemDialog = ({ children }: ListItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "home", name: "Home & Garden", icon: "🏠" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "books", name: "Books", icon: "📚" },
    { id: "automotive", name: "Automotive", icon: "🚗" },
    { id: "collectibles", name: "Collectibles", icon: "🎨" },
    { id: "other", name: "Other", icon: "📦" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length <= 5) {
      setImages([...images, ...files]);
    }
  };

  const { createListing } = useListing();

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload images to IPFS one by one
      const imageUrls: string[] = [];

      for (const image of images) {
        try {
          const upload = await pinata.upload.public.file(image);
          const response = upload as any;
          const ipfsHash = response.cid || (response.data && response.data.IpfsHash);

          if (ipfsHash) {
            imageUrls.push(`https://ipfs.io/ipfs/${ipfsHash}`);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }

      // Create metadata JSON
      const metadata: Metadata = {
        title: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        location: "Not Specified",
        seller: {
          name: "Anonymous",
          address: "0x0000..."
        },
        images: imageUrls,
        category: formData.category,
        condition: "Not Specified",
        escrowAmount: parseFloat(formData.price) * 0.1
      };

      // Upload metadata to IPFS
      const metadataUpload = await pinata.upload.public.json(metadata);
      const response2 = metadataUpload as any;
      const ipfsHash = response2.IpfsHash || (response2.data && response2.data.IpfsHash);

      console.log("Metadata IPFS Hash:", ipfsHash);
      console.log("Full metadata:", metadata);

      // Call the smart contract to create the listing
      await createListing(
        metadata.description,
        `https://ipfs.io/ipfs/${ipfsHash}`,
        metadata.price.toString()
      );
      console.log("Listing created successfully");

      setOpen(false);
      // Reset form
      setFormData({ name: "", category: "", price: "", description: "" });
      setImages([]);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            List Your Item
          </DialogTitle>
          <DialogDescription>
            Create a new listing with escrow protection. Fill in the details
            below to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Images (up to 5)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={images.length >= 5}
                />
                <div className="aspect-square border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg flex flex-col items-center justify-center bg-green-50 dark:bg-green-950/50 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                  <Upload className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                  <span className="text-xs text-green-600 dark:text-green-400 text-center">
                    {images.length >= 5 ? "Max reached" : "Add Image"}
                  </span>
                </div>
              </div>

              {/* Preview Images */}
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-green-200 dark:border-green-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload clear, high-quality images to attract buyers
            </p>
          </div>

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Item Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., MacBook Pro 2023 - M2 Chip"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              required
            >
              <SelectTrigger className="border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price (CORE) *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="price"
                type="number"
                min="0"
                step="0.000001"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="pl-10 border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400"
                required
              />
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                Escrow: $
                {formData.price
                  ? (parseFloat(formData.price) * 0.1).toFixed(5)
                  : "0.00"}
              </Badge>
              <span>(10% of price)</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail. Include condition, features, and any relevant information..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px] border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400"
              required
            />
            <p className="text-xs text-muted-foreground">
              Be detailed and honest about the item's condition
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Escrow Protection
                </h4>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Your listing will be protected by our smart contract escrow
                  system. You'll need to stake 10% of the price to ensure buyer
                  confidence.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Listing..." : "Create Listing"}
              <Plus className="w-4 h-4 mr-2" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListItemDialog;
