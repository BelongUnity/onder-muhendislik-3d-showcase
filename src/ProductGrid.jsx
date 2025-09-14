import React, { useState, useEffect, useMemo, memo, useCallback } from 'react'
import './ProductGrid.css'

// Memoized ProductItem component for better performance
const ProductItem = memo(({ 
  item, 
  index, 
  clickedProduct, 
  hoveredProduct, 
  onProductClick, 
  onProductHover, 
  onProductLeave 
}) => {
  return (
    <div
      key={index}
      className={`grid-cell ${item ? 'has-product' : 'empty'} ${hoveredProduct === index ? 'hovered' : ''}`}
      onClick={() => onProductClick(item, index)}
      onMouseEnter={() => onProductHover(index)}
      onMouseLeave={onProductLeave}
    >
      {item ? (
        <div className="product-container">
          <img 
            src={`/${item.thumbnail}`} 
            alt={item.name}
            className={`product-image ${clickedProduct === index ? 'visible' : ''}`}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
            loading="lazy" // Lazy load images for better performance
          />
          <div 
            className={`product-name ${clickedProduct === index ? 'hidden' : ''}`}
          >
            {item.name}
          </div>
        </div>
      ) : (
        <div className="empty-cell"></div>
      )}
    </div>
  )
})

ProductItem.displayName = 'ProductItem'

function ProductGrid({ onProductSelect, activeTab }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [clickedProduct, setClickedProduct] = useState(null)
  const [hoveredProduct, setHoveredProduct] = useState(null)

  useEffect(() => {
    // Load products based on active tab
    const loadProducts = async () => {
      setLoading(true)
      try {
        let dataFile = ''
        switch (activeTab) {
          case 'kampanyalar':
            dataFile = '/data/kampanyalar.json'
            break
          case 'projeler':
            dataFile = '/data/projeler.json'
            break
          case 'komponentler':
            dataFile = '/data/komponentler.json'
            break
          case 'yakicilar':
            dataFile = '/data/yakicilar.json'
            break
          default:
            dataFile = '/data/kampanyalar.json'
        }
        
        const response = await fetch(dataFile)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [activeTab])

  // Reset clicked product when tab changes (for cached components)
  useEffect(() => {
    setClickedProduct(null)
    setHoveredProduct(null)
  }, [activeTab])

  const handleProductClick = useCallback((product, index) => {
    if (!product) return

    if (clickedProduct === index) {
      // Second click - navigate to product
      onProductSelect(product)
    } else {
      // First click - show image (only this product)
      setClickedProduct(index)
    }
  }, [clickedProduct, onProductSelect])

  const handleProductHover = useCallback((index) => {
    setHoveredProduct(index)
  }, [])

  const handleProductLeave = useCallback(() => {
    setHoveredProduct(null)
  }, [])

  // Memoize display array to prevent unnecessary re-renders
  const displayArray = useMemo(() => products, [products])

  if (loading) {
    return (
      <div className="product-grid">
        <div className="loading">
          <img 
            src="/images/onder_logo.png" 
            alt="Önder" 
            className="loading-logo"
          />
          <div>Ürünler yükleniyor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="product-grid">
      <div className="products-container">
        {displayArray.map((item, index) => (
          <ProductItem
            key={index}
            item={item}
            index={index}
            clickedProduct={clickedProduct}
            hoveredProduct={hoveredProduct}
            onProductClick={handleProductClick}
            onProductHover={handleProductHover}
            onProductLeave={handleProductLeave}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid