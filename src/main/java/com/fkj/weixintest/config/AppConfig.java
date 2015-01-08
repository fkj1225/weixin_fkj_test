/**
 * 
 */
package com.fkj.weixintest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@PropertySources(value = { @PropertySource("classpath:db.properties") })
@ComponentScan(basePackages = { "com.fkj.weixintest.bean","com.fkj.weixintest.repository","com.fkj.weixintest.service"}, 
	excludeFilters = @ComponentScan.Filter(value = Controller.class, type = FilterType.ANNOTATION))
@Import(value = { JpaAutogenspringConfig.class, DataSourceConfig.class })
@EnableTransactionManagement
public class AppConfig {

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        jpaVendorAdapter.setDatabase(Database.MYSQL);
        jpaVendorAdapter.setGenerateDdl(false);
        jpaVendorAdapter.setShowSql(true);
        return jpaVendorAdapter;
    }
}
