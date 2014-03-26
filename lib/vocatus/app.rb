require 'slim'
require 'sass'
require 'sinatra/base'
require 'vocatus/routes'
require 'vocatus/slim_helpers'
require 'vocatus/template_helpers'
require 'vocatus/authentication'

module Vocatus
  module Datorum
    class App < Sinatra::Base
      include SlimHelpers
      include TemplateHelpers
      include Authentication

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
        pass if params[:splat].first.include? '.' # normal pages will never have periods, it's probably a js file
        slim :main
      end
    end
  end
end
