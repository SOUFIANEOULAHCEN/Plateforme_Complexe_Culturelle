import { Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#8B4513] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-6">
            <a href="#" className="text-[#FDF8F5] hover:opacity-75 transition-opacity">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-[#FDF8F5] hover:opacity-75 transition-opacity">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-[#FDF8F5] hover:opacity-75 transition-opacity">
              <Youtube size={24} />
            </a>
          </div>
          <p className="text-[#FDF8F5] text-center">@Copyright Complexe Culturel OUARZAZATE. Tous droits reservés by HSHM</p>
        </div>
      </div>
    </footer>
  )
}

