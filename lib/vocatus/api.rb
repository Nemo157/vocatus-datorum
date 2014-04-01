require 'gipan'

require_relative 'authentication'

require_relative 'api/cocktail'
require_relative 'api/recipe'
require_relative 'api/ingredient'
require_relative 'api/user'
require_relative 'api/user_session'

module Vocatus
  module Datorum
    class Api < GipAN::Api
      include Authentication

      resource Cocktail
      resource Recipe
      resource Ingredient

      resource User
      resource UserSession

      enable :logging

      configure :development do
        puts 'Simulating really slow connection/Api'
        before do
          sleep 1
        end
      end
    end
  end
end
