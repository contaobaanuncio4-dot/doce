export default function PromoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">
          <img 
            src="https://tabuademinas.com/cdn/shop/files/ChatGPT_Image_2_de_jul._de_2025_17_28_28.png?v=1751488475&width=1400"
            alt="Promoção Tábua de Minas"
            className="max-w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '300px' }}
          />
        </div>
      </div>
    </div>
  );
}