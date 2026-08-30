import ProductCard from "./ProductCard";

export default function CollectionSection({ products, searchQuery }) {
  return (
    <section 
      id="collection-section"
      className="relative z-30 bg-[#FBF9F4] text-[#171513] rounded-t-[40px] sm:rounded-t-[64px] shadow-[0_-15px_40px_rgba(20,17,12,0.04)] px-6 sm:px-12 py-16 sm:py-24 border-t border-[#E5DCCB] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl space-y-12 font-sans">
        {/* Collection Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-[#E5DCCB] pb-6 gap-4">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#886D3B]">
              SHOP BOUTIQUE
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl font-light tracking-wide text-[#171513] uppercase mt-1">
              THE COLLECTION
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-sans font-bold uppercase tracking-widest text-[#716B63]">
            {searchQuery && (
              <span className="text-[#886D3B] font-bold">
                FILTERS ACTIVE
              </span>
            )}
            <span>
              {products.length} {products.length === 1 ? "ITEM" : "ITEMS"} FOUND
            </span>
          </div>
        </div>

        {/* Grid or Empty view */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 border border-dashed border-[#E5DCCB] p-8 bg-[#FFFDF8] rounded-2xl">
            <div className="text-4xl">🔍</div>
            <h3 className="font-brand text-lg font-light text-[#171513]">No items match your search</h3>
            <p className="text-xs text-[#716B63] max-w-md mx-auto leading-relaxed">
              We couldn't find matches for "{searchQuery}". Try adjusting your keywords or clearing the search.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
