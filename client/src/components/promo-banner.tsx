export default function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white py-12 text-center" style={{ background: 'linear-gradient(to right, #DDAF36, #DDAF36, #DDAF36)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          PROMOÇÃO DE JULHO
        </h2>
        <p className="text-xl md:text-2xl font-semibold mb-6">
          Compre 3 produtos e ganhe um Queijo Brie!!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-lg font-medium">
          <span className="bg-white/20 px-4 py-2 rounded-full">
            🧀 Queijos & Doces direto de Minas
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full">
            🔥 Até 4x sem juros
          </span>
        </div>
      </div>
    </div>
  );
}