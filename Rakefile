require 'rubygems'
require 'rake'
require 'modulr'
require 'erb'

task :build_js do
  mkdir_p('js')
  js = Modulr.ize(File.join('src', 'program.js'), { :sync => true })
  File.open(File.join('js', 'main.js'), 'w') { |f| f << js }
  js_size = js.length
  css_size = File.read(File.join('css', 'main.css')).length
  html_size = File.read('index.html').length
  puts "JS size: #{js_size}"
  puts "CSS size: #{css_size}"
  puts "HTML size: #{html_size}"
  puts "---------------------------"
  puts "TOTAL: #{ js_size + css_size + html_size  }"
end

task :build_inline do
  js = Modulr.ize(File.join('src', 'program.js'), { :sync => true })
  css = File.read(File.join('css', 'main.css'))
  template = File.read('index.template')
  File.open('inline.html', 'w') {
    |f| f << template.gsub(/\{\{\s*(\w+)\s*\}\}/) do |m|
      eval($1)
    end
  }
end

task :max_inline do
  css = File.read(File.join('css', 'main.css'))
  template = File.read('max.template')
  File.open('max_inline.html', 'w') {
    |f| f << template.gsub(/\{\{\s*(\w+)\s*\}\}/) do |m|
      eval($1)
    end
  }
end

