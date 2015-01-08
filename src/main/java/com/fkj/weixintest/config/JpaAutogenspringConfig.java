/**
 *Create By @Author:Sean Lei
 *@Date:2014年10月10日
 *@Email:sean.yu.lei@gmail.com
 */
package com.fkj.weixintest.config;

import javax.annotation.Resource;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import com.fkj.weixintest.jpa.JpaRepositoryWsdFactoryBean;

@Configuration
@EnableJpaRepositories(basePackages = {"com.fkj.weixintest.repository" },
	entityManagerFactoryRef = "autogenspringEntityManagerFactory", 
	transactionManagerRef = "autogenspringTransactionManager",
	repositoryFactoryBeanClass=JpaRepositoryWsdFactoryBean.class)
public class JpaAutogenspringConfig {

    @Resource
    private JpaVendorAdapter jpaVendorAdapter;

    @Resource(name = "autogenspringDataSource")
    private DataSource autogenspringDataSource;

    @Bean(name = "autogenspringTransactionManager")
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager txManager = new JpaTransactionManager();
        txManager.setEntityManagerFactory(entityManagerFactory());
        return txManager;
    }

    @Bean(name = "autogenspringEntityManagerFactory")
    public EntityManagerFactory entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean lemfb = new LocalContainerEntityManagerFactoryBean();
        lemfb.setDataSource(autogenspringDataSource);
        lemfb.setJpaVendorAdapter(jpaVendorAdapter);
        lemfb.setPersistenceUnitName("autogenspringPersistenceUnit");
        lemfb.setPackagesToScan("com.fkj.weixintest.bean");
        // 返回factory需要先设置afterProperties
        lemfb.afterPropertiesSet();
        return lemfb.getObject();
    }
}
