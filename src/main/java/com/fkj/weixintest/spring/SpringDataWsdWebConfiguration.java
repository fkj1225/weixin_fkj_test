/**
 * 
 */
package com.fkj.weixintest.spring;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.repository.support.DomainClassConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.data.web.SortHandlerMethodArgumentResolver;
import org.springframework.format.FormatterRegistry;
import org.springframework.format.support.FormattingConversionService;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author magicjhxie
 * 
 */
@Configuration
public class SpringDataWsdWebConfiguration extends WebMvcConfigurerAdapter{

	@Autowired
	private ApplicationContext context;

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.data.web.config.SpringDataWebConfiguration#
	 * pageableResolver()
	 */
	@Bean
	public PageableHandlerMethodArgumentResolver pageableResolver() {
		
		PageableHandlerMethodArgumentResolver pageableHandlerMethodArgumentResolver = new PageableHandlerMethodArgumentResolver(sortResolver());
		
		pageableHandlerMethodArgumentResolver.setOneIndexedParameters(true);
		pageableHandlerMethodArgumentResolver.setPageParameterName("pageNo");
		pageableHandlerMethodArgumentResolver.setSizeParameterName("pageSize");
		pageableHandlerMethodArgumentResolver.setMaxPageSize(50);
		
		return pageableHandlerMethodArgumentResolver;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.data.web.config.SpringDataWebConfiguration#sortResolver
	 * ()
	 */
	@Bean
	public SortHandlerMethodArgumentResolver sortResolver() {
		return new SortHandlerMethodArgumentResolver();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter
	 * #addFormatters(org.springframework.format.FormatterRegistry)
	 */
	@Override
	public void addFormatters(FormatterRegistry registry) {

		if (!(registry instanceof FormattingConversionService)) {
			return;
		}

		registerDomainClassConverterFor((FormattingConversionService) registry);
	}

	private void registerDomainClassConverterFor(
			FormattingConversionService conversionService) {

		DomainClassConverter<FormattingConversionService> converter = new DomainClassConverter<FormattingConversionService>(
				conversionService);
		converter.setApplicationContext(context);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter
	 * #addArgumentResolvers(java.util.List)
	 */
	@Override
	public void addArgumentResolvers(
			List<HandlerMethodArgumentResolver> argumentResolvers) {

		argumentResolvers.add(sortResolver());
		argumentResolvers.add(pageableResolver());
	}
}
