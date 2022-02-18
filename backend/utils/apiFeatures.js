class ApiFeatures {
  constructor(query, queryString) {
    this.query = query, 
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i", // Case insensitive
          },
        }
      : {};
    
    this.query = this.query.find({ ...keyword })

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString }

    // Removing fields from query
    const fieldsToRemove = [ 'keyword', 'limit', 'page' ];
    fieldsToRemove.forEach(field => delete queryCopy[field]);

    // Advanced filter for price, rating etc.
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  pagination(productsPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skipProductsCount = productsPerPage * ( currentPage - 1);

    this.query = this.query.limit(productsPerPage).skip(skipProductsCount);
    return this;
  }
}

module.exports = ApiFeatures