require 'slim'
require 'sass'
require 'sinatra/base'
require 'vocatus/slim_helpers'

module Vocatus
  module Datorum
    class App < Sinatra::Base
      include SlimHelpers

      enable :logging

      set :root, File.realpath('../../', File.dirname(__FILE__))

      get '/' do
        params[:page] = :index
        slim :main
      end

      get '/:page' do
        pass if params[:page].include?('.')
        slim :main
      end

      get '/:page/*' do
        pass if params[:splat].first.include?('.')
        slim :main
      end

      get '/templates/*.html' do
        if settings.production?
          slim params[:splat].first.to_sym rescue slim :missing
        else
          slim params[:splat].first.to_sym
        end
      end
    end
  end
end
