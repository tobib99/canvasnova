'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart } from "lucide-react"

const productTypes = [
  { id: 'acrylic', name: 'Acrylic Prints', description: 'Vibrant colors and depth with a modern, glossy finish' },
  { id: 'metal', name: 'Metal Prints', description: 'Sleek and durable with a contemporary metallic sheen' },
  { id: 'framed', name: 'Framed Prints', description: 'Classic elegance with a variety of frame options' },
  { id: 'canvas', name: 'Canvas Prints', description: 'Textured surface for a timeless, artistic look' },
  { id: 'photo', name: 'Photo Prints', description: 'Traditional prints on high-quality photo paper' },
  { id: 'giclee', name: 'Giclée Prints', description: 'Museum-quality prints for fine art reproductions' },
]

const formatOptions = [
  { id: 'landscape', name: 'Landscape', description: 'Perfect for scenic views and horizontal compositions' },
  { id: 'portrait', name: 'Portrait', description: 'Ideal for vertical compositions and portraits' },
  { id: 'square', name: 'Square', description: 'Balanced format suitable for Instagram-style images' },
  { id: 'panoramic', name: 'Panoramic', description: 'Wide format for sweeping vistas and cinematic shots' },
]

const sizeOptions = {
  landscape: [
    { id: '40x30', name: '40 x 30 cm', description: 'Compact size, great for smaller walls or grouped displays' },
    { id: '60x45', name: '60 x 45 cm', description: 'Medium size, perfect for living rooms and offices' },
    { id: '80x60', name: '80 x 60 cm', description: 'Large size, makes a bold statement in any room' },
    { id: '120x90', name: '120 x 90 cm', description: 'Extra large, ideal for feature walls and spacious areas' },
  ],
  portrait: [
    { id: '30x40', name: '30 x 40 cm', description: 'Compact size, perfect for portraits and narrow spaces' },
    { id: '45x60', name: '45 x 60 cm', description: 'Medium size, great for hallways and bedrooms' },
    { id: '60x80', name: '60 x 80 cm', description: 'Large size, makes a striking impression' },
    { id: '90x120', name: '90 x 120 cm', description: 'Extra large, creates a dramatic focal point' },
  ],
  square: [
    { id: '30x30', name: '30 x 30 cm', description: 'Small square, perfect for Instagram prints and compact spaces' },
    { id: '50x50', name: '50 x 50 cm', description: 'Medium square, ideal for balanced compositions' },
    { id: '70x70', name: '70 x 70 cm', description: 'Large square, makes a bold geometric statement' },
    { id: '100x100', name: '100 x 100 cm', description: 'Extra large square, creates a powerful visual impact' },
  ],
  panoramic: [
    { id: '90x30', name: '90 x 30 cm', description: 'Wide panoramic, perfect for landscapes and cityscapes' },
    { id: '120x40', name: '120 x 40 cm', description: 'Extra wide, ideal for showcasing sweeping vistas' },
    { id: '150x50', name: '150 x 50 cm', description: 'Ultra-wide, creates a cinematic experience on your wall' },
  ],
}

const materialOptions = {
  acrylic: [
    { id: 'photo-under-acrylic', name: 'Photo Print Under Acrylic Glass', price: 99.95, description: 'Vibrant colors with depth and brilliance. Choose from 2mm, 4mm, or 6mm acrylic glass for stunning gallery-quality prints.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'ultrahd-under-acrylic', name: 'ultraHD Photo Print Under Acrylic Glass', price: 129.95, description: 'Unparalleled sharpness and color accuracy using Fuji Crystal Professional Archive Maxima Paper, perfect for detailed images.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'acrylic-ultrahd-metallic', name: 'Acrylic ultraHD Metallic Print', price: 149.95, description: 'Double resolution with a metallic sheen under 2mm acrylic glass. Ideal for images with bright, vivid areas.', image: '/placeholder.svg?height=100&width=100' },
  ],
  metal: [
    { id: 'direct-print-aluminum', name: 'Direct Print On Aluminum Dibond', price: 79.95, description: 'Modern matte finish with a silk-gloss shimmer in bright areas. Suitable for indoor and sheltered outdoor use.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'photo-print-aluminum', name: 'Photo Print On Aluminum Backing', price: 89.95, description: 'Elegant mounting without glass. Choose from matte or glossy lamination and three photo paper options.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'ultrahd-aluminum', name: 'ultraHD Photo Print On Aluminum Dibond', price: 109.95, description: 'Exceptional detail and color accuracy on durable, lightweight aluminum. Available in glossy or matte finish.', image: '/placeholder.svg?height=100&width=100' },
  ],
  framed: [
    { id: 'magnet-frame', name: 'Magnet Frame', price: 129.95, description: 'Modern silver aluminum frame with a natural white mat. Easy to change prints with magnetic system.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'floater-frame', name: 'Floater Frame', price: 149.95, description: 'Creates an illusion of a floating image. Various colors and materials available for a custom look.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'aluminum-artbox', name: 'Aluminium ArtBox', price: 169.95, description: 'Sleek aluminum floating frame with various depths available. Elegant and contemporary.', image: '/placeholder.svg?height=100&width=100' },
  ],
  canvas: [
    { id: 'matte-canvas', name: 'Matte Canvas On Stretcher Frame', price: 89.95, description: 'Matte surface. Canvas texture with a warm, natural look. Great for portraits and artistic images', image: '/placeholder.svg?height=100&width=100' },
    { id: 'glossy-canvas', name: 'Glossy Canvas On Stretcher Frame', price: 99.95, description: 'Glossy surface. Especially luminous and lively. For images with lots of contrast and rich colours', image: '/placeholder.svg?height=100&width=100' },
    { id: 'textile-print', name: 'Textile Print On Stretcher Frame', price: 109.95, description: 'Fine woven fabric with a subtle sheen. A modern alternative to traditional canvas.', image: '/placeholder.svg?height=100&width=100' },
  ],
  photo: [
    { id: 'fuji-crystal', name: 'Photo Print On Fuji Crystal DP II', price: 29.95, description: 'A classic paper for all kinds of photos. Especially suited to images with intense colours. Matte, glossy, silk or velvet surface', image: '/placeholder.svg?height=100&width=100' },
    { id: 'ultrahd-photo', name: 'ultraHD Photo Print', price: 39.95, description: 'Exceptional detail and color accuracy. Ideal for images with fine details and subtle tones.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'fujiflex', name: 'Photo Print On Fujiflex High Gloss', price: 49.95, description: 'Super glossy finish for maximum vibrancy. Durable 235 g/m² paper resistant to tearing.', image: '/placeholder.svg?height=100&width=100' },
  ],
  giclee: [
    { id: 'hahnemuhle-william-turner', name: 'Hahnemühle William Turner', price: 79.95, description: 'Textured, matte watercolor paper. 310 g/m², 100% cotton, perfect for artistic reproductions.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'hahnemuhle-torchon', name: 'Hahnemühle Torchon', price: 89.95, description: 'Distinctly textured surface with a three-dimensional appearance. 285 g/m², 100% α-cellulose.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'hahnemuhle-photo-rag', name: 'Hahnemühle Photo Rag', price: 99.95, description: 'Smooth matte surface. 308 g/m², 100% cotton,  ideal for both color and black-and-white prints.', image: '/placeholder.svg?height=100&width=100' },
  ],
}

const frameOptions = {
  default: [
    { id: 'none', name: 'No Frame', price: 0, description: 'Clean, frameless look that lets your image speak for itself.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'black', name: 'Black Frame', price: 49.95, description: 'Classic black frame that adds a touch of elegance to any image.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'white', name: 'White Frame', price: 49.95, description: 'Crisp white frame for a fresh, modern look.', image: '/placeholder.svg?height=100&width=100' },
  ],
  canvas: [
    { id: 'none', name: 'No Frame', price: 0, description: 'Traditional gallery-wrapped edge for a classic canvas look.', image: '/placeholder.svg?height=100&width=100' },
    { id: 'floater', name: 'Floater Frame', price: 79.95, description: 'Sleek frame that creates the illusion of a floating canvas.', image: '/placeholder.svg?height=100&width=100' },
  ],
}

const mountingOptions = [
  { id: 'none', name: 'No mounting', description: 'Receive your print unmounted for custom framing or mounting later.', price: 0 },
  { id: 'alu-dibond', name: 'Alu-Dibond', description: 'Lightweight yet sturdy aluminum composite backing for a sleek, modern look.', price: 39.95 },
  { id: 'foam-board', name: 'Foam Board', description: 'Affordable, lightweight option ideal for temporary displays or exhibitions.', price: 19.95 },
  { id: 'gallery-board', name: 'Gallery Board', description: 'Sturdy, archival-quality mounting board perfect for long-term display.', price: 29.95 },
]

const shippingOptions = [
  { id: 'standard', name: 'Standard Shipping', price: 9.95, description: 'Delivery within 5-7 business days.' },
  { id: 'express', name: 'Express Shipping', price: 24.95, description: 'Expedited delivery within 2-3 business days.' },
  { id: 'overnight', name: 'Overnight Shipping', price: 39.95, description: 'Next-day delivery for urgent orders.' },
]

export default function WhitewallArtworkCustomizationV7() {
  const searchParams = useSearchParams()
  const artworkUrl = searchParams.get('artworkUrl') || '/placeholder.svg?height=400&width=600'

  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState({
    productType: '',
    format: '',
    size: '',
    material: '',
    frame: '',
    mounting: '',
    shipping: ''
  })
  const [totalPrice, setTotalPrice] = useState(0)

  const steps = [
    { id: 'productType', title: 'Product Type' },
    { id: 'format', title: 'Format' },
    { id: 'size', title: 'Size' },
    { id: 'material', title: 'Material' },
    { id: 'frame', title: 'Frame', condition: (s) => s.productType !== 'canvas' },
    { id: 'mounting', title: 'Mounting Options', condition: (s) => ['photo', 'giclee'].includes(s.productType) },
    { id: 'shipping', title: 'Shipping' },
  ].filter(step => !step.condition || step.condition(selections))

  useEffect(() => {
    calculateTotalPrice()
  }, [selections])

  const calculateTotalPrice = () => {
    let price = 0
    if (selections.material) {
      const materialOption = materialOptions[selections.productType]?.find(m => m.id === selections.material)
      price += materialOption?.price || 0
    }
    if (selections.frame && selections.frame !== 'none') {
      const frameOption = (selections.productType === 'canvas' ? frameOptions.canvas : frameOptions.default).find(f => f.id === selections.frame)
      price += frameOption?.price || 0
    }
    if (selections.mounting && selections.mounting !== 'none') {
      price += mountingOptions.find(m => m.id === selections.mounting)?.price || 0
    }
    if (selections.shipping) {
      price += shippingOptions.find(s => s.id === selections.shipping)?.price || 0
    }
    setTotalPrice(price)
  }

  const handleSelection = (key: string, value: string) => {
    setSelections(prev => {
      const newSelections = { ...prev, [key]: value }
      if (key === 'productType') {
        return { ...newSelections, material: '', frame: '', mounting: '' }
      }
      if (key === 'format') {
        return { ...newSelections, size: '' }
      }
      return newSelections
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addToCart = () => {
    console.log('Adding to cart:', selections)
    alert('Product added to cart!')
  }

  const ImageGallery = ({ images }) => (
    <div className="flex space-x-2 mt-2">
      {images.map((image, index) => (
        <Dialog key={index}>
          <DialogTrigger>
            <Image src={image} alt={`Option image ${index + 1}`} width={50} height={50} className="rounded-md cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <Image src={image} alt={`Option image ${index + 1}`} width={800} height={600} className="rounded-lg" />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )

  const renderStepContent = () => {
    const step = steps[currentStep]
    switch (step.id) {
      case 'productType':
        return (
          <RadioGroup value={selections.productType} onValueChange={(value) => handleSelection('productType', value)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productTypes.map((option) => (
                <div key={option.id} className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors h-64">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="overflow-hidden">
                      <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{option.description}</p>
                    </div>
                  </div>
                  <ImageGallery images={['/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100']} />
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      case 'format':
        return (
          <RadioGroup value={selections.format} onValueChange={(value) => handleSelection('format', value)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formatOptions.map((option) => (
                <div key={option.id} className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors h-64">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="overflow-hidden">
                      <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{option.description}</p>
                    </div>
                  </div>
                  <ImageGallery images={['/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100']} />
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      case 'size':
        return (
          <Select value={selections.size} onValueChange={(value) => handleSelection('size', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {selections.format && sizeOptions[selections.format].map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="py-2">
                    <span className="font-medium">{option.name}</span>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'material':
        return (
          <RadioGroup value={selections.material} onValueChange={(value) => handleSelection('material', value)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materialOptions[selections.productType]?.map((option) => (
                <div key={option.id} className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors h-96">
                  <div className="flex items-start space-x-4">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="flex-grow overflow-hidden">
                      <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{option.description}</p>
                      <p className="text-sm font-semibold mt-2">Price: £{option.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <ImageGallery images={[option.image, '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100']} />
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      case 'frame':
        const frameOptionsToUse = selections.productType === 'canvas' ? frameOptions.canvas : frameOptions.default
        return (
          <RadioGroup value={selections.frame} onValueChange={(value) => handleSelection('frame', value)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frameOptionsToUse.map((option) => (
                <div key={option.id} className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors h-96">
                  <div className="flex items-start space-x-4">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="flex-grow overflow-hidden">
                      <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{option.description}</p>
                      <p className="text-sm font-semibold mt-2">Price: £{option.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <ImageGallery images={[option.image, '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100']} />
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      case 'mounting':
        return (
          <RadioGroup value={selections.mounting} onValueChange={(value) => handleSelection('mounting', value)}>
            <div className="space-y-4">
              {mountingOptions.map((option) => (
                <div key={option.id} className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="flex-grow">
                      <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      <p className="text-sm font-semibold mt-2">Price: £{option.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <ImageGallery images={['/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100', '/placeholder.svg?height=100&width=100']} />
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      case 'shipping':
        return (
          <RadioGroup value={selections.shipping} onValueChange={(value) => handleSelection('shipping', value)}>
            <div className="space-y-4">
              {shippingOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="flex-grow">
                    <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    <p className="text-sm font-semibold mt-2">Price: £{option.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto gap-8 p-4 font-sans" style={{ fontFamily: 'Syne, sans-serif' }}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Artwork Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <Image src={artworkUrl} alt="Artwork preview" width={600} height={400} className="object-contain" />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="shadow-lg flex-grow">
          <CardHeader>
            <CardTitle className="text-2xl">Customize Your Whitewall Print</CardTitle>
            <CardDescription>Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</CardDescription>
            <Progress value={(currentStep + 1) / steps.length * 100} className="mt-2" />
          </CardHeader>
          <CardContent className="h-[600px] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">Previous</Button>
              <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
            <div className="text-xl font-bold">
              Total: £{totalPrice.toFixed(2)}
            </div>
          </CardFooter>
        </Card>
        <Card className="shadow-lg w-full lg:w-1/3">
          <CardHeader>
            <CardTitle className="text-2xl">Selected Options</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {Object.entries(selections).map(([key, value]) => {
                if (!value) return null
                let displayValue = value
                let image = null
                if (key === 'material' && selections.productType) {
                  const material = materialOptions[selections.productType]?.find(m => m.id === value)
                  displayValue = material?.name || value
                  image = material?.image
                } else if (key === 'frame') {
                  const frame = (selections.productType === 'canvas' ? frameOptions.canvas : frameOptions.default).find(f => f.id === value)
                  displayValue = frame?.name || value
                  image = frame?.image
                }
                return (
                  <div key={key} className="flex items-center space-x-4 mb-4 p-2 bg-gray-50 rounded-lg">
                    {image && <Image src={image} alt={displayValue} width={50} height={50} className="rounded-md" />}
                    <div>
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm text-gray-600">{displayValue}</p>
                    </div>
                  </div>
                )
              })}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={addToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}