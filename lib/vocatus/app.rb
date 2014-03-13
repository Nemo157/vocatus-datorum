require 'slim'
require 'sass'
require 'sinatra'
require 'vocatus/slim_helpers'
require 'vocatus/api'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://vocatus_datorum:vocatus_datorum@localhost/vocatus_datorum')
DataMapper.finalize
DataMapper.auto_upgrade!

require 'vocatus/seed'

Vocatus::Datorum::Api.finalize

class String
  # Strip leading whitespace from each line that is the same as the 
  # amount of whitespace on the first line of the string.
  # Leaves _additional_ indentation on later lines intact.
  def unindent
    gsub(/^#{self[/\A\s*/]}/, '')
  end
end

module Vocatus
  module Datorum
    class App < Sinatra::Base
      include SlimHelpers

      enable :logging

      set :root, File.realpath('../../', File.dirname(__FILE__))

      get '/' do
        params[:page] = :index
        slim :main do
          slim :index rescue halt 404
        end
      end

      get '/:page' do
        slim :main do
          slim params[:page].to_sym rescue redirect to('/')
        end
      end

      get '/templates/:template.html' do
        slim params[:template].to_sym rescue halt 404
      end
    end
  end
end
