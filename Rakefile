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

TEMPLATE_REGEXP = /\{\{\s*(\w+)\s*\}\}/

task :build_inline do
  mkdir_p('inline_output')
  js = Modulr.ize(File.join('src', 'program.js'), { :sync => true })
  css = File.read(File.join('css', 'main.css'))
  output = 'self_contained_app.html'
  File.delete(output) if File.exist?(output)
  File.open(output, 'w') do |f|
    f << File.read('index.template').gsub(TEMPLATE_REGEXP) { |m| eval($1) }
  end
end

task :build_test do
  css = File.read(File.join('css', 'main.css'))
  output = 'for_testing_purposes_only.html'
  File.delete(output) if File.exist?(output)
  File.open(output, 'w') do |f|
    f << File.read('max.template').gsub(TEMPLATE_REGEXP) { |m| eval($1) }
  end
end

