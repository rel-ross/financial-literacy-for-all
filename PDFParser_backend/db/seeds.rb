# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'pry'
require 'pdf-reader'
require 'open-uri'
Page.destroy_all


io = open("https://firebasestorage.googleapis.com/v0/b/mod-3-project-a1e21.appspot.com/o/node-sample-simplified.pdf?alt=media&token=60805945-6bbb-45b9-a7ca-42b4bb28c16a/")
reader = PDF::Reader.new(io)
# reader = PDF::Reader.new("./node-sample-simplified.pdf")

reader.pages.each do |page|
    # puts page.fonts
    pageText = page.text
    puts pageText
    payStub = Page.create(content: page.text)
    # puts page.raw_content
  end

