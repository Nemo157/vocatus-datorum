require 'slim'
require 'sass'
require 'sinatra/base'
require 'vocatus/routes'
require 'vocatus/slim_helpers'
require 'vocatus/template_helpers'

module Vocatus
  module Datorum
    class App < Sinatra::Base
      include SlimHelpers
      include TemplateHelpers

      enable :logging

      set :root, File.realpath('../../', File.dirname(__FILE__))

      get '/templates/*.html' do
        render_template params[:splat].first
      end

      get '/routes' do
        content_type :json
        Routes.to_json
      end

      get '/*' do
        slim :main
      end
    end
  end
end
