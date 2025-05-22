/* eslint-disable jsx-a11y/accessible-emoji */
import { useMemo, useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getGenderClass = sex => {
  return sex === 'm' ? 'has-text-link' : 'has-text-danger';
};

const getCategoryIcon = category => {
  return `${category.icon} - ${category.title}`;
};

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const products = useMemo(() => {
    return productsFromServer.map(product => {
      const category = categoriesFromServer.find(
        c => c.id === product.categoryId,
      );
      const user = usersFromServer.find(u => u.id === category?.ownerId);

      return { ...product, category, user };
    });
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter(product => {
      const matchesUser =
        selectedUserId === null || product.user?.id === selectedUserId;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategoryId === null ||
        product.category?.id === selectedCategoryId;

      return matchesUser && matchesSearch && matchesCategory;
    });
  }, [products, selectedUserId, searchText, selectedCategoryId]);

  const resetFilters = () => {
    setSelectedUserId(null);
    setSearchText('');
    setSelectedCategoryId(null);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === null ? 'is-active' : ''}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchText && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchText('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => setSelectedCategoryId(null)}
                className={`button is-outlined mr-6 my-1 ${
                  selectedCategoryId === null ? 'is-success' : ''
                }`}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`button is-outlined mr-2 my-1 ${
                    selectedCategoryId === category.id ? 'is-info' : ''
                  }`}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                onClick={resetFilters}
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {visibleProducts.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>

                    <td data-cy="ProductCategory">
                      {product.category
                        ? getCategoryIcon(product.category)
                        : 'No category'}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={getGenderClass(product.user?.sex)}
                    >
                      {product.user?.name || 'No user'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
