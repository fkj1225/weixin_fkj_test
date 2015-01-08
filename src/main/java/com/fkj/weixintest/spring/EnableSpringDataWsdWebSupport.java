/**
 * 
 */
package com.fkj.weixintest.spring;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.data.web.config.HateoasAwareSpringDataWebConfiguration;
import org.springframework.data.web.config.SpringDataJacksonConfiguration;
import org.springframework.util.ClassUtils;

/**
 * @author magicjhxie
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Inherited
@Import(EnableSpringDataWsdWebSupport.SpringDataWebConfigurationImportSelector.class)
public @interface EnableSpringDataWsdWebSupport {

	/**
	 * Import selector to import the appropriate configuration class depending on whether Spring HATEOAS is present on the
	 * classpath. We need to register the HATEOAS specific class first as apparently only the first class implementing
	 * {@link org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport} gets callbacks invoked (see
	 * https://jira.springsource.org/browse/SPR-10565).
	 * 
	 * @author Oliver Gierke
	 */
	class SpringDataWebConfigurationImportSelector implements ImportSelector {

		// Don't make final to allow test cases faking this to false
		private static boolean HATEOAS_PRESENT = ClassUtils.isPresent("org.springframework.hateoas.Link", null);
		private static boolean JACKSON_PRESENT = ClassUtils.isPresent("com.fasterxml.jackson.databind.ObjectMapper", null);

		/* 
		 * (non-Javadoc)
		 * @see org.springframework.context.annotation.ImportSelector#selectImports(org.springframework.core.type.AnnotationMetadata)
		 */
		@Override
		public String[] selectImports(AnnotationMetadata importingClassMetadata) {

			List<String> imports = new ArrayList<String>();

			System.out.println("HATEOAS_PRESENT"+HATEOAS_PRESENT);
			
			imports.add(HATEOAS_PRESENT ? HateoasAwareSpringDataWebConfiguration.class.getName()
					: SpringDataWsdWebConfiguration.class.getName());

			if (JACKSON_PRESENT) {
				imports.add(SpringDataJacksonConfiguration.class.getName());
			}

			return imports.toArray(new String[imports.size()]);
		}
	}
}
