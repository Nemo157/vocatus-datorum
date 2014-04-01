require_relative 'entity'

module Vocatus
  module Datorum
    class Cocktail
      include Entity

      property :name, String, required: true, unique: true
      property :image_url, String, length: 0..400
      property :description, Text

      has n, :recipes
    end

    require_relative 'recipe'
  end
end
