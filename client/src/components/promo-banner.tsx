export default function PromoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">
          <img 
            src="https://i.imgur.com/ED3AJEr.png"
            alt="Promoção Tábua de Minas"
            className="max-w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '300px' }}
          />
        </div>
      </div>
    </div>
  );
}