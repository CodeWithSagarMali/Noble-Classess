import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Image as ImageIcon, Camera } from 'lucide-react';

interface GalleryItemData {
  id: string;
  imageUrl: string;
  albumName: string;
  caption?: string;
}

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const fallbackItems: GalleryItemData[] = [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800', albumName: 'Classrooms', caption: 'Interactive digital boards class session.' },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', albumName: 'Campus', caption: 'State-of-the-art libraries and research labs.' },
    { id: '3', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800', albumName: 'Events', caption: 'Historic selection results board celebrations.' },
    { id: '4', imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800', albumName: 'Campus', caption: 'Quiet student self-study halls.' },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/cms/gallery');
        if (res.data?.status === 'success') {
          setItems(res.data.data);
        }
      } catch (err) {
        console.warn('Gallery API offline, utilizing fallbacks', err);
        setItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const albums = ['All', 'Classrooms', 'Campus', 'Events'];

  const filteredItems = selectedAlbum === 'All' 
    ? items 
    : items.filter(item => item.albumName.toLowerCase() === selectedAlbum.toLowerCase());

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-16 px-6 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-sans">Our Photo Gallery</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          Take a virtual tour of our premium infrastructure, study halls, interactive classrooms, and student events.
        </p>
      </div>

      {/* Album tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => setSelectedAlbum(album)}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold border transition-all ${
              selectedAlbum === album
                ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setModalImage(item.imageUrl)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 aspect-video shadow-premium transition-transform hover:scale-[1.01]"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.caption || 'Noble Classes Gallery'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="bg-teal-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded w-max mb-1">
                  {item.albumName}
                </span>
                <p className="text-white text-xs font-bold truncate">
                  {item.caption || 'Click to enlarge'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-teal-400 text-xl font-bold"
            onClick={() => setModalImage(null)}
          >
            ✕ Close
          </button>
          <img
            src={modalImage}
            alt="Enlarged view"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};

export default Gallery;
