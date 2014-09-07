$: << 'lib'

require 'sinatra'

require 'bundler/setup'
require 'vocatus/setup'
require 'vocatus/api'
require 'vocatus/app'

configure :production do
  require 'newrelic_rpm'
end

map '/vendor' do
  run Rack::Directory.new('node_modules')
end
map '/vendor2' do
  run Rack::Directory.new('vendor2')
end
map '/api' do
  run Vocatus::Datorum::Api
end
map '/' do
  run Vocatus::Datorum::App
end
