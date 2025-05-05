export default function Gallery() {
    const images = [
      {
        id: 1,
        src: "/assets/computer.jpeg",
        alt: "Computer Lab",
      },
      {
        id: 2,
        src: "/assets/library.jfif",
        alt: "Library Space",
      },
      {
        id: 3,
        src: "/assets/theater2.jpg",
        alt: "Theater",
      },
      {
        id: 4,
        src: "/assets/study.jpeg",
        alt: "Study Area",
      },
      {
        id: 5,
        src: "/assets/workspace.jpeg",
        alt: "Workshop Space",
      },
      {
        id: 6,
        src: "/assets/meeting.jfif",
        alt: "Meeting Room",
      },
      {
        id: 7,
        src: "/assets/theater.jpeg",
        alt: "Auditorium",
      },
      {
        id: 8,
        src: "/assets/creative.jfif",
        alt: "Creative Space",
      },
      {
        id: 9,
        src: "/assets/reading.jfif",
        alt: "Reading Area",
      },
      {
        id: 10,
        src: "/assets/art.jpeg",
        alt: "Art Studio",
      },
    ]
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-[#8B4513] text-center">Galeries</h2>
          <p className="text-xl text-[#8B4513] text-center mb-12">Explorez Notre Complexe Culturel</p>
  
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative group cursor-pointer ${index === 2 ? "md:col-span-2" : ""} ${
                  index === 5 ? "md:row-span-2" : ""
                }`}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full  object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-10"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-medium">{image.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  