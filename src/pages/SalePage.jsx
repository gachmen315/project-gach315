import Breadcrumb from '@/components/Breadcrumb';
import Skeleton from '@/components/Skeleton';
import { PATH } from '@/config';
import useQuery from '@/hooks/useQuery';
import useScrollTop from '@/hooks/useScrollTop';
import { productTiles } from '@/services/product.service';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './sale.css'

const optionSort = [
  {
    value: 1,
    title: 'Gạch ốp lát',
  },
  {
    value: 2,
    title: 'Tấm ốp nhựa',
  },
  {
    value: 3,
    title: 'Thiết bị vệ sinh',
  },
];

const SalePage = () => {
  useScrollTop()

  const [activeIndex, setActiveIndex] = useState(0);
  const [productCode, setProductCode] = useState();

  const idProduct = activeIndex + 1

  useEffect(() => {
    if (idProduct == 1) {
      setProductCode('thiet-bi-ve-sinh')
    } else if (idProduct == 2) {
      setProductCode('gach-op-lat')
    } else {
      setProductCode('tam-op-nhua')
    }
  }, [idProduct])

  const clickProductSell = (index) => {
    setActiveIndex(index)
  }

  const params = {
    keyword: '',
    pageIndex: 1,
    pageSize: 50,
    productType: productCode
  }

  const {
    data: { data: listDiscount = [], loading: loadingListDiscount } = {},
  } = useQuery({
    queryKey: `product-page-${JSON.stringify(productCode)}`,
    keepPreviousData: true,
    keepStorage: false,
    queryFn: ({ signal }) => productTiles.productListDiscounted(params, signal),
    enabled: !!productCode,
  });

  return (
    <>
      <nav className="py-3 bg-[#f5f5f5] mb-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {!loadingListDiscount ? (
                <Breadcrumb>
                  <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                  <Breadcrumb.Item>Sản phẩm giảm giá</Breadcrumb.Item>
                </Breadcrumb>
              ) : (
                <Skeleton width={577} height={18} borderRadius={4} />
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="layout-collection">
        <div className="container">
          {loadingListDiscount ? (
            <LoadingDetail />
          ) : (
            <div className='row'>
              <div className="flex col-12">
                <h2 className="mb-4 inline-block font-bold text-3xl uppercase font-oswald relative pb-2 product-h2-custom">
                  Sản phẩm giảm giá
                </h2>
                <div className='h-auto flex justify-end flex-1 overflow-hidden'>
                  <div className="relative max-w-full">
                    <ul className='flex max-w-full whitespace-nowrap p-0 m-0 text-right pb-2 overflow-x-auto overflow-y-hidden list-none'>
                      {['Thiết bị vệ sinh', 'Gạch ốp lát', 'Tấm ốp nhựa'].map((item, index) => (
                        <li
                          key={index}
                          className={`relative font-medium bg-gray-200 px-5 py-1.5 transition-all duration-300 tab-cate ${activeIndex === index ? 'li-current' : ''}`}
                          onClick={() => clickProductSell(index)}
                        >
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* <div className='col-12 col-title'>
                <h1>
                  Sản phẩm giảm giá
                </h1>
              </div>
              <div className='block-collection col-sm-12 col-12 col-md-12'>
                <div className='col-list-cate'>
                  <div className="tab-ul">
                    <div className="menu-list">
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="select-container">
                    <select className="custom-select custom-select-xs" onChange={handleSortChange}>
                      {optionSort.map((e) => (
                        <option value={e?.value} key={e.value}>
                          {e.title}
                        </option>
                      ))}
                    </select>
                    <FontAwesomeIcon icon={faFilter} className="select-icon" />
                  </div>
                </div>
              </div> */}
              <div className={`products-view my-5 col-sm-12 col-12 col-md-12 ${listDiscount?.length === 0 ? 'no-products' : ''}`}>
                {listDiscount && listDiscount.length > 0 ? (
                  <div className="product-grid">
                    {listDiscount.map((product) => (
                      <div key={product.id} className="product-detail">
                        <div className="products-view-card">
                          <Link className="navbar-brand" to={`${PATH.productDetail.replace(':slug', product.code)}`}>
                            <img style={{ height: 'auto' }} srcSet={product.images[0].base_url} alt={product.name} />
                          </Link>
                          <div className="product-card-content">
                            <h3 className="product-card-title">{product.name}</h3>
                            <div className="product-box">
                              <span className="product-box-price">
                                {Number(product.discountedPrice).toLocaleString('vi-VN')}đ
                              </span>
                              <span className="product-compare-price">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="product-button">
                              <Link to={PATH.contact} className="btn-product-contact">
                                Liên hệ
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-products-message">
                    <img src="/img/not-found.png" alt="" />
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  )
}

const LoadingDetail = () => {
  return (
    <div className="layout-collection">
      <div className="container">
        <div className="row">
          {/* Title Skeleton */}
          <div className="col-12 col-title">
            <Skeleton width={200} height={30} className="mb-3" />
          </div>

          {/* Categories Skeleton */}
          <div className="block-collection col-sm-12 col-12 col-md-12">
            <div className="col-list-cate">
              <div className="tab-ul">
                <div className="menu-list">
                  {createArray(4).map((_, id) => (
                    <Skeleton key={id} width={100} height={30} className="cate-item mb-3" />
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Select Skeleton */}
            <div className="ml-3">
              <div className="select-container">
                <Skeleton width={150} height={40} />
              </div>
            </div>
          </div>

          {/* Product List Skeleton */}
          <div className="products-view my-5 col-sm-12 col-12 col-md-12">
            <div className="container row">
              <div className="product-detail">
                {createArray(6).map((_, id) => (
                  <div key={id} className="products-view-card mb-5">
                    <Skeleton width={200} height={250} className="mb-3" />

                    {/* Product Info Skeleton */}
                    <div className="product-card-content">
                      <Skeleton width={150} height={30} className="mb-2" />
                      <div className="product-box mb-2">
                        <Skeleton width={80} height={20} />
                        <Skeleton width={80} height={20} className="ml-3" />
                      </div>
                      <Skeleton width={100} height={30} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalePage