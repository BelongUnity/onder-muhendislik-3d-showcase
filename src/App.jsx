import React, { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import ProductGrid from './ProductGrid.jsx'
import ProductViewer3D from './ProductViewer3D.jsx'
import './App.css'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSubPart, setSelectedSubPart] = useState(null)
  const [activeTab, setActiveTab] = useState('kampanyalar') // Default tab

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setSelectedSubPart(null)
  }

  const handleSubPartSelect = (subPart) => {
    setSelectedSubPart(subPart)
  }

  const handleBackToGallery = () => {
    // Clear cache for the product being deselected
    if (selectedProduct) {
      const modelPaths = [
        selectedProduct.model_path,
        ...(selectedProduct.sub_parts?.map(subPart => subPart.model_path) || [])
      ]
      
      modelPaths.forEach(path => {
        if (path) {
          try {
            useGLTF.clear(path)
          } catch (error) {
            console.warn('Failed to clear model cache:', error)
          }
        }
      })
    }
    
    setSelectedProduct(null)
    setSelectedSubPart(null)
  }

  const handleBackToProduct = () => {
    setSelectedSubPart(null)
  }

  const handleTabChange = (tabName) => {
    // Don't do anything if clicking the same tab
    if (tabName === activeTab) {
      return
    }
    
    setActiveTab(tabName)
    // Clear selected product when changing tabs
    setSelectedProduct(null)
    setSelectedSubPart(null)
  }

  return (
    <div className="app">
      {/* Header Section - Hidden when product is selected */}
      {!selectedProduct && (
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-container">
                <img 
                  src="/images/onder_logo.png" 
                  alt="Önder" 
                  className="onder-logo"
                />
                <img 
                  src="/images/onder_50_logo.png" 
                  alt="Önder 50 Years" 
                  className="onder-50-logo"
                />
              </div>
            </div>
            <div className="header-right">
              <p className="main-description">
                Endüstriyel yakma sistemleri ve bileşenleri için interaktif ürün kataloğu.
              </p>
            </div>
          </div>
        </header>
      )}

      {/* Tab System - Hidden when product is selected */}
      {!selectedProduct && (
        <div className="tab-container">
          <ul className="tab-list">
            <li className="tab-item">
              <button 
                className={`tab-button ${activeTab === 'kampanyalar' ? 'active' : ''}`}
                onClick={() => handleTabChange('kampanyalar')}
              >
                Kampanyalar
              </button>
            </li>
            <li className="tab-item">
              <button 
                className={`tab-button ${activeTab === 'projeler' ? 'active' : ''}`}
                onClick={() => handleTabChange('projeler')}
              >
                Projeler
              </button>
            </li>
            <li className="tab-item">
              <button 
                className={`tab-button ${activeTab === 'komponentler' ? 'active' : ''}`}
                onClick={() => handleTabChange('komponentler')}
              >
                Komponentler
              </button>
            </li>
            <li className="tab-item">
              <button 
                className={`tab-button ${activeTab === 'yakicilar' ? 'active' : ''}`}
                onClick={() => handleTabChange('yakicilar')}
              >
                Yakıcılar
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`app-main ${selectedProduct ? 'fullscreen' : ''}`}>
        {!selectedProduct ? (
          <div className="product-grid-container">
            {/* Cache all ProductGrid components for instant switching */}
            <div style={{ display: activeTab === 'kampanyalar' ? 'block' : 'none' }}>
              <ProductGrid 
                onProductSelect={handleProductSelect} 
                activeTab="kampanyalar" 
              />
            </div>
            <div style={{ display: activeTab === 'projeler' ? 'block' : 'none' }}>
              <ProductGrid 
                onProductSelect={handleProductSelect} 
                activeTab="projeler" 
              />
            </div>
            <div style={{ display: activeTab === 'komponentler' ? 'block' : 'none' }}>
              <ProductGrid 
                onProductSelect={handleProductSelect} 
                activeTab="komponentler" 
              />
            </div>
            <div style={{ display: activeTab === 'yakicilar' ? 'block' : 'none' }}>
              <ProductGrid 
                onProductSelect={handleProductSelect} 
                activeTab="yakicilar" 
              />
            </div>
          </div>
        ) : (
          <ProductViewer3D
            product={selectedProduct}
            subPart={selectedSubPart}
            onBackToGallery={handleBackToGallery}
            onBackToProduct={handleBackToProduct}
            onSubPartSelect={handleSubPartSelect}
          />
        )}
      </main>

      {/* Footer Section - Hidden when product is selected */}
      {!selectedProduct && (
        <footer className="app-footer">
          <div className="footer-content">
            <div className="group-logos">
              <img 
                src="/images/Grup logolar.png" 
                alt="Group Logos" 
              />
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App