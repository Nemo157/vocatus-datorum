$: << 'lib'

require 'bundler/setup'
require 'slim'
require 'sinatra'
require 'vocatus/api'
require 'vocatus/app'

map '/api' do
  run Vocatus::Datorum::Api
end
map '/' do
  run Vocatus::Datorum::App
end
