/**
 *Create By @Author:Sean Lei
 *@Date:2014年10月10日
 *@Email:sean.yu.lei@gmail.com
 */
package com.fkj.weixintest.config;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.format.Formatter;
import org.springframework.format.FormatterRegistry;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import com.fkj.weixintest.spring.EnableSpringDataWsdWebSupport;

@Configuration
@EnableWebMvc
@EnableSpringDataWsdWebSupport
@ComponentScan(basePackages = { "com.fkj.weixintest.controller" }, includeFilters = @ComponentScan.Filter(value = Controller.class, type = FilterType.ANNOTATION))
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    	registry.addResourceHandler("/js/**").addResourceLocations("/js/");
		registry.addResourceHandler("/ui/**").addResourceLocations("/ui/");
		registry.addResourceHandler("/css/**").addResourceLocations("/css/");
		registry.addResourceHandler("/images/**").addResourceLocations("/images/");
		registry.addResourceHandler("/asset/**").addResourceLocations("/asset/");
    }

    @Bean
    public ViewResolver configureViewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/resources/jsp/");
        viewResolver.setSuffix(".jsp");
        viewResolver.setViewClass(JstlView.class);
        return viewResolver;
    }

    /**
	 * 上传文件支持
	 * @see FileUploadController
	 * @return
	 */
	@Bean
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(500000);
        return multipartResolver;
    }
	
	@Override
	public void addArgumentResolvers( List<HandlerMethodArgumentResolver> argumentResolvers ) {
	    
		super.addArgumentResolvers( argumentResolvers );
	}
	
	@Override
	public void configureMessageConverters(
			List<HttpMessageConverter<?>> converters) {

		converters.add(converter());
		super.configureMessageConverters(converters);
	}
	
	@SuppressWarnings("deprecation")
	@Bean
    MappingJacksonHttpMessageConverter converter() {
        MappingJacksonHttpMessageConverter converter = new MappingJacksonHttpMessageConverter();
        
        ObjectMapper objectMapper = new ObjectMapper();
        
        objectMapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		converter.setObjectMapper(objectMapper );
        
        return converter;
    }
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		
		
		HandlerInterceptor interceptor = new HandlerInterceptor() {
			
			@Override
			public boolean preHandle(HttpServletRequest request,
					HttpServletResponse response, Object handler) throws Exception {
				// TODO Auto-generated method stub
				return true;
			}
			
			@Override
			public void postHandle(HttpServletRequest request,
					HttpServletResponse response, Object handler,
					ModelAndView modelAndView) throws Exception {
				response.setCharacterEncoding("UTF-8");
				
			}
			
			@Override
			public void afterCompletion(HttpServletRequest request,
					HttpServletResponse response, Object handler, Exception ex)
					throws Exception {
				// TODO Auto-generated method stub
				
			}
		};
		
		
		registry.addInterceptor(interceptor);
		
		super.addInterceptors(registry);
	}

	@Override
	public void addFormatters(FormatterRegistry registry) {

		Formatter<Timestamp> formatter = new Formatter<Timestamp>() {
			
			private DateFormatter delegator = new DateFormatter();
			
			@Override
			public Timestamp parse(String text, Locale locale) throws ParseException {
				if(StringUtils.isEmpty(text)){
					return new Timestamp(System.currentTimeMillis());
				}if(NumberUtils.isNumber(text)){
					return new Timestamp(Long.parseLong(text));
				}else{
					return new Timestamp(delegator.parse(text, locale).getTime());
				}
				
			}
			
			@Override
			public String print(Timestamp object, Locale locale) {
				// TODO Auto-generated method stub
				return delegator.print(object, locale);
			}
		};
		registry.addFormatterForFieldType(Timestamp.class, formatter );
		
		super.addFormatters(registry);
	}

}
