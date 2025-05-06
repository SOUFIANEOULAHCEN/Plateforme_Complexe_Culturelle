import React from "react"

const Library = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Bibliothèque</h2>
        <p className="text-gray-600 mb-8">
          La bibliothèque du Complexe Culturel Ouarzazate est un espace de savoir et de découverte, ouvert à tous les
          publics, avec pour mission de favoriser l'accès à la lecture et à la connaissance.
          {/* ... (rest of the text) ... */}
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">Voir Plus</button>
      </div>
    </div>
  )
}

export default Library