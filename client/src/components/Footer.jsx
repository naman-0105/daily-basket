import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'

const Footer = () => {
  const categoryData = useSelector(state => state.product.allCategory) || []
  const subCategoryData = useSelector(state => state.product.allSubCategory) || []

  const getFirstSubCategory = (categoryId) => {
    const subCategory = subCategoryData.find(sub => 
      sub.category.some(cat => cat._id === categoryId)
    )
    return subCategory
  }

  const handleCategoryLink = (category) => {
    const subCategory = getFirstSubCategory(category._id)
    if (subCategory) {
      return `/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(subCategory.name)}-${subCategory._id}`
    }
    return '#'
  }

  // Split categories into three columns
  const columnSize = Math.ceil(categoryData.length / 3)
  const firstColumn = categoryData.slice(0, columnSize)
  const secondColumn = categoryData.slice(columnSize, columnSize * 2)
  const thirdColumn = categoryData.slice(columnSize * 2)

  return (
    <footer className='border-t bg-white mt-8'>
      <div className='container mx-auto p-8 flex flex-col items-center'>
        <h2 className='text-xl font-semibold mb-6 text-center'>Various Categories</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl'>
          {/* First Column */}
          <div className='flex flex-col gap-2 items-center'>
            {firstColumn.map(category => (
              <Link 
                key={category._id}
                to={handleCategoryLink(category)}
                className='text-gray-600 hover:text-primary-200 transition-colors text-center'
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Second Column */}
          <div className='flex flex-col gap-2 items-center'>
            {secondColumn.map(category => (
              <Link 
                key={category._id}
                to={handleCategoryLink(category)}
                className='text-gray-600 hover:text-primary-200 transition-colors text-center'
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Third Column */}
          <div className='flex flex-col gap-2 items-center'>
            {thirdColumn.map(category => (
              <Link 
                key={category._id}
                to={handleCategoryLink(category)}
                className='text-gray-600 hover:text-primary-200 transition-colors text-center'
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className='text-center mt-8 pt-4 border-t w-full'>
          <p>© All Rights Reserved 2025.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
