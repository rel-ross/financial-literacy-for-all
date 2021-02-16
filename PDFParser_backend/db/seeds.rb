# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'pry'
require 'pdf-reader'
Page.destroy_all

# private_key_json_string = File.open('~/paystub-literacy-firebase-adminsdk-cxfj8-d6fd6ca25e.json').read
# firebase = Firebase::Client.new(base_uri, private_key_json_string)

io     = open("https://firebasestorage.googleapis.com/v0/b/paystub-literacy.appspot.com/o/node-sample-simplified.pdf?alt=media&token=a1eab332-819f-4ef1-88ef-675d1498c480")
reader = PDF::Reader.new(io)

reader.pages.each do |page|
    # puts page.fonts
    pageText = page.text
    puts pageText
    payStub = Page.create(content: page.text)
    # puts page.raw_content
  end

